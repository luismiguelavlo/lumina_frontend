import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicRankingApiService } from '../../../shared/data-access/public-ranking-api.service';
import { StudentsApiService } from '../../../shared/data-access/students-api.service';
import type { StudentsApiItem } from '../../../shared/models/students-api.model';
import type { PublicRankLookupResult } from '../../../shared/models/public-ranking.models';
import { PUBLIC_RANKING_PODIUM_FALLBACK, mapTopRankingToPublicPodium } from '../data/public-ranking-demo.data';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LEN = 1;

@Injectable()
export class PublicRankingStore {
  private readonly rankingApi = inject(PublicRankingApiService);
  private readonly studentsApi = inject(StudentsApiService);

  private readonly top3Entries = toSignal(
    this.rankingApi.getTop3().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  readonly podiumLeaders = computed(() => {
    const entries = this.top3Entries();
    return entries.length === 0 ? PUBLIC_RANKING_PODIUM_FALLBACK : mapTopRankingToPublicPodium(entries);
  });

  readonly lookupControl = new FormControl<string>('', { nonNullable: true });
  readonly lookupResult = signal<PublicRankLookupResult | null>(null);
  readonly lookupError = signal<string | null>(null);
  readonly isLoadingRanking = signal(false);
  readonly selectedStudentId = signal<string | null>(null);

  private readonly studentSearchState = toSignal(
    this.lookupControl.valueChanges.pipe(
      startWith(this.lookupControl.value),
      debounceTime(SEARCH_DEBOUNCE_MS),
      map((v) => (v ?? '').trim()),
      distinctUntilChanged(),
      switchMap((searchText) => {
        this.lookupError.set(null);
        this.lookupResult.set(null);
        if (searchText.length < MIN_SEARCH_LEN) {
          return of({ loading: false, items: [] as readonly StudentsApiItem[] });
        }
        return this.studentsApi.listStudents({ limit: 20, offset: 0, search: searchText }).pipe(
          map((r) => ({ loading: false, items: r.data })),
          startWith({ loading: true, items: [] as readonly StudentsApiItem[] }),
          catchError((error: unknown) => {
            this.lookupError.set(this.toStudentSearchErrorMessage(error));
            return of({ loading: false, items: [] as readonly StudentsApiItem[] });
          }),
        );
      }),
    ),
    { initialValue: { loading: false, items: [] as readonly StudentsApiItem[] } },
  );

  readonly suggestionItems = computed(() => this.studentSearchState().items);

  readonly suggestions = computed(() =>
    this.suggestionItems().map((s) => ({
      id: s.id,
      label: `${s.first_name} ${s.last_name}`.trim() || 'Sin nombre',
      subtitle: s.student_id_code || s.email || s.id,
    })),
  );

  readonly loadingSuggestions = computed(() => this.studentSearchState().loading);

  pickStudent(studentId: string): void {
    if (this.isLoadingRanking()) {
      return;
    }
    this.selectedStudentId.set(studentId);
    this.isLoadingRanking.set(true);
    this.lookupError.set(null);

    this.rankingApi
      .getStudentRanking(studentId)
      .pipe(
        take(1),
        finalize(() => this.isLoadingRanking.set(false)),
      )
      .subscribe({
        next: (result) => {
          this.lookupResult.set(result);
        },
        error: (error: unknown) => {
          this.lookupResult.set(null);
          this.lookupError.set(this.toRankingErrorMessage(error));
        },
      });
  }

  onLookupConsult(): void {
    if (this.isLoadingRanking()) {
      return;
    }
    const items = this.suggestionItems();
    const selected = this.selectedStudentId();

    if (items.length === 1) {
      this.pickStudent(items[0].id);
      return;
    }

    if (selected && items.some((i) => i.id === selected)) {
      this.pickStudent(selected);
      return;
    }

    if (items.length > 1) {
      this.lookupError.set('Selecciona un estudiante de la lista para ver su ranking.');
      return;
    }

    const q = this.lookupControl.value.trim();
    if (q.length < MIN_SEARCH_LEN) {
      this.lookupError.set('Escribí al menos un carácter para buscar.');
      return;
    }

    this.lookupError.set('No hay estudiantes que coincidan. Probá con otro nombre o correo.');
  }

  private toStudentSearchErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudieron buscar estudiantes.';
    }
    if (error.status === 0) {
      return 'No hay conexión con el servidor.';
    }
    return 'No se pudieron buscar estudiantes.';
  }

  private toRankingErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No se pudo obtener el ranking de este estudiante.';
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 404) {
      return 'No hay datos de ranking para este estudiante.';
    }

    if (error.status === 0) {
      return 'No hay conexión con el servidor.';
    }

    return 'No se pudo obtener el ranking de este estudiante.';
  }
}
