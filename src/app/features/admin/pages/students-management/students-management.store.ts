import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import type { StudentPatronRow } from '../../../../shared/models/student-patron.model';
import type {
  CreateStudentRequest,
  StudentsApiPagination,
  StudentsApiResponse,
} from '../../../../shared/models/students-api.model';
import type { LumSelectOption } from '../../../../shared/ui/molecules/lum-neo-select-field/lum-neo-select-field.component';

const PAGE_SIZE = 20;
const AVATAR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80';

@Injectable()
export class StudentsManagementStore {
  private readonly studentsApi = inject(StudentsApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly currentPage = signal(1);
  private readonly refreshNonce = signal(0);
  private readonly isLoadingState = signal(false);
  private readonly didInitialRetry = signal(false);

  readonly pageSubtitle = 'Manage library students, outstanding sanctions, and account statuses.';
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly loadError = signal<string | null>(null);
  readonly isCreateModalOpen = signal(false);
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);
  readonly createSuccess = signal<string | null>(null);

  readonly createForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    degreeLevel: ['Undergraduate Student', [Validators.required]],
    major: ['', [Validators.required, Validators.minLength(2)]],
    expectedGraduationYear: [new Date().getFullYear() + 1, [Validators.required, Validators.min(1900)]],
  });

  readonly degreeOptions: readonly LumSelectOption[] = [
    { value: 'Undergraduate Student', label: 'Undergraduate Student' },
    { value: 'Graduate Student', label: 'Graduate Student' },
    { value: 'Doctoral Student', label: 'Doctoral Student' },
    { value: 'Faculty', label: 'Faculty' },
  ];

  private readonly searchText = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(250),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  private readonly query = computed(() => ({
    limit: PAGE_SIZE,
    offset: (this.currentPage() - 1) * PAGE_SIZE,
    search: this.searchText().trim(),
    nonce: this.refreshNonce(),
  }));

  private readonly studentsResponse = toSignal(
    toObservable(this.query).pipe(
      switchMap((q) => {
        this.isLoadingState.set(true);
        this.loadError.set(null);
        return this.studentsApi.listStudents(q).pipe(
          catchError((error: unknown) => {
            this.loadError.set(this.toErrorMessage(error));
            return of(this.emptyResponse(q.limit, q.offset));
          }),
          finalize(() => this.isLoadingState.set(false)),
        );
      }),
    ),
    { initialValue: this.emptyResponse(PAGE_SIZE, 0) },
  );

  readonly rows = computed<readonly StudentPatronRow[]>(() =>
    this.studentsResponse().data.map((row) => ({
      patronId: row.student_id_code || row.id,
      routeId: row.id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      status: row.is_active ? 'active' : 'sanctioned',
      dateApplied: this.formatDate(row.member_since ?? row.created_at),
      reason: null,
      avatarAlt: `Avatar of ${row.first_name} ${row.last_name}`.trim(),
      avatarUrl: AVATAR_PLACEHOLDER,
    })),
  );

  readonly pagination = computed<StudentsApiPagination>(() => this.studentsResponse().pagination);
  readonly isLoading = computed(() => this.isLoadingState());

  constructor() {
    effect(() => {
      this.searchText();
      this.currentPage.set(1);
    });

    // Some environments fail first load transiently; retry once automatically.
    effect(() => {
      if (this.didInitialRetry()) return;
      if (this.isLoading()) return;
      if ((this.searchText() ?? '').trim().length > 0) return;
      if (this.currentPage() !== 1) return;
      if (this.pagination().total > 0) return;
      if (!this.loadError()) return;

      this.didInitialRetry.set(true);
      this.refreshNonce.update((n) => n + 1);
    });
  }

  goToPrevPage(): void {
    if (!this.pagination().has_prev) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  goToNextPage(): void {
    if (!this.pagination().has_next) return;
    this.currentPage.update((p) => p + 1);
  }

  retryLoad(): void {
    this.refreshNonce.update((n) => n + 1);
  }

  openCreateModal(): void {
    this.createError.set(null);
    this.createSuccess.set(null);
    this.createForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      degreeLevel: 'Undergraduate Student',
      major: '',
      expectedGraduationYear: new Date().getFullYear() + 1,
    });
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    if (this.isCreating()) return;
    this.isCreateModalOpen.set(false);
    this.createError.set(null);
  }

  submitCreateStudent(): void {
    if (this.isCreating()) return;
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.createError.set('Please complete all required fields with valid values.');
      return;
    }

    const v = this.createForm.getRawValue();
    const payload: CreateStudentRequest = {
      first_name: v.firstName.trim(),
      last_name: v.lastName.trim(),
      email: v.email.trim(),
      degree_level: v.degreeLevel,
      major: v.major.trim(),
      expected_graduation_year: Math.trunc(v.expectedGraduationYear),
    };

    this.isCreating.set(true);
    this.createError.set(null);

    this.studentsApi
      .createStudent(payload)
      .pipe(
        take(1),
        finalize(() => this.isCreating.set(false)),
      )
      .subscribe({
        next: (created) => {
          this.isCreateModalOpen.set(false);
          this.createSuccess.set(`Student created successfully (${created.student_id_code}).`);
          this.currentPage.set(1);
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.createError.set(this.toCreateErrorMessage(error));
        },
      });
  }

  private emptyResponse(limit: number, offset: number): StudentsApiResponse {
    return {
      data: [],
      total: 0,
      pagination: {
        limit,
        offset,
        count: 0,
        total: 0,
        current_page: Math.floor(offset / limit) + 1,
        total_pages: 0,
        has_next: false,
        has_prev: offset > 0,
      },
    };
  }

  private formatDate(value?: string): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No fue posible cargar los estudiantes.';
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return 'No fue posible conectar con el servidor.';
    }

    return 'No fue posible cargar los estudiantes.';
  }

  private toCreateErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No fue posible crear el estudiante.';
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (error.status === 409) {
      return typeof backendMessage === 'string' && backendMessage.trim()
        ? backendMessage
        : 'El recurso ya existe';
    }

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return 'No fue posible conectar con el servidor.';
    }

    return 'No fue posible crear el estudiante.';
  }
}
