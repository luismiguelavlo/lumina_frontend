import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
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
import type { SanctionRow } from '../../../../shared/models/sanction-row.model';
import type { SanctionsApiPagination, SanctionsApiResponse } from '../../../../shared/models/sanctions-api.model';
import { I18nService } from '../../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { SanctionsApiService } from '../../../../shared/data-access/sanctions-api.service';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import type { StudentsApiItem } from '../../../../shared/models/students-api.model';
import { LumSanctionsActiveTableComponent } from '../../../../shared/ui/organisms/lum-sanctions-active-table/lum-sanctions-active-table.component';
import { LumStudentsNeoSearchComponent } from '../../../../shared/ui/molecules/lum-students-neo-search/lum-students-neo-search.component';
import { LumConfirmActionModalComponent } from '../../../../shared/ui/organisms/lum-confirm-action-modal/lum-confirm-action-modal.component';

@Component({
  selector: 'app-sanctions-management-page',
  imports: [
    LumStudentsNeoSearchComponent,
    LumSanctionsActiveTableComponent,
    LumConfirmActionModalComponent,
    TranslatePipe,
  ],
  templateUrl: './sanctions-management.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctionsManagementPage {
  private readonly sanctionsApi = inject(SanctionsApiService);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly i18n = inject(I18nService);
  private readonly currentPage = signal(1);
  private readonly refreshNonce = signal(0);

  protected readonly searchQuery = signal('');
  protected readonly selectedStudent = signal<StudentsApiItem | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isStudentLookupLoading = signal(false);
  protected readonly isLiftingSanction = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly actionSuccess = signal<string | null>(null);
  protected readonly pendingLiftSanction = signal<SanctionRow | null>(null);

  private readonly studentLookupQuery = toSignal(
    toObservable(this.searchQuery).pipe(startWith(''), debounceTime(250), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly studentSuggestions = toSignal(
    toObservable(this.studentLookupQuery).pipe(
      switchMap((query) => {
        const q = query.trim();
        if (!q || this.selectedStudent()) {
          return of([] as readonly StudentsApiItem[]);
        }
        this.isStudentLookupLoading.set(true);
        return this.studentsApi.listStudents({ limit: 10, offset: 0, search: q }).pipe(
          map((res) => res.data.slice(0, 6)),
          catchError(() => of([] as readonly StudentsApiItem[])),
          finalize(() => this.isStudentLookupLoading.set(false)),
        );
      }),
    ),
    { initialValue: [] as readonly StudentsApiItem[] },
  );

  private readonly sanctionsResponse = toSignal(
    toObservable(
      computed(() => ({
        page: this.currentPage(),
        studentId: this.selectedStudent()?.id ?? null,
        nonce: this.refreshNonce(),
      })),
    ).pipe(
      switchMap(({ page, studentId }) => {
        this.isLoading.set(true);
        this.loadError.set(null);
        return this.sanctionsApi
          .listSanctions({
            limit: 20,
            offset: (page - 1) * 20,
            student_id: studentId ?? undefined,
          })
          .pipe(
            catchError((error: unknown) => {
              this.loadError.set(this.toErrorMessage(error, 'sanctions.errors.load'));
              return of(this.emptyResponse(page));
            }),
            finalize(() => this.isLoading.set(false)),
          );
      }),
    ),
    { initialValue: this.emptyResponse(1) },
  );

  protected readonly filteredRows = computed((): readonly SanctionRow[] => {
    this.i18n.locale();
    return this.sanctionsResponse().data.map((row) => {
      const studentName =
        `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || this.i18n.t('sanctions.unknownStudent');
      return {
        id: row.sanction_id,
        studentName,
        recordId: row.student_id_code ?? row.student_id,
        initials: this.initialsFromName(studentName),
        reason: row.reason,
        appliedOnLabel: this.formatDate(row.applied_at),
        appliedByLabel: row.applied_by_id ?? this.i18n.t('sanctions.appliedBySystem'),
      } satisfies SanctionRow;
    });
  });

  protected readonly pagination = computed<SanctionsApiPagination>(() => this.sanctionsResponse().pagination);

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.actionSuccess.set(null);
    if (this.selectedStudent() && value !== this.fullName(this.selectedStudent()!)) {
      this.selectedStudent.set(null);
    }
    this.currentPage.set(1);
  }

  protected pickStudent(student: StudentsApiItem): void {
    this.selectedStudent.set(student);
    this.searchQuery.set(this.fullName(student));
    this.actionSuccess.set(null);
    this.currentPage.set(1);
  }

  protected clearSelectedStudent(): void {
    this.selectedStudent.set(null);
    this.searchQuery.set('');
    this.actionSuccess.set(null);
    this.currentPage.set(1);
  }

  protected prevPage(): void {
    if (!this.pagination().has_prev) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  protected nextPage(): void {
    if (!this.pagination().has_next) return;
    this.currentPage.update((p) => p + 1);
  }

  protected onLiftSanction(row: SanctionRow): void {
    if (this.isLiftingSanction()) return;
    this.pendingLiftSanction.set(row);
  }

  protected cancelLiftSanction(): void {
    if (this.isLiftingSanction()) return;
    this.pendingLiftSanction.set(null);
  }

  protected confirmLiftSanction(): void {
    const pending = this.pendingLiftSanction();
    if (!pending || this.isLiftingSanction()) return;

    this.isLiftingSanction.set(true);
    this.loadError.set(null);
    this.actionSuccess.set(null);

    this.sanctionsApi
      .liftSanction(pending.id)
      .pipe(
        take(1),
        finalize(() => this.isLiftingSanction.set(false)),
      )
      .subscribe({
        next: () => {
          this.pendingLiftSanction.set(null);
          this.actionSuccess.set(this.i18n.t('sanctions.success.lifted', { id: pending.id }));
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.loadError.set(this.toErrorMessage(error, 'sanctions.errors.lift'));
        },
      });
  }

  private emptyResponse(currentPage: number): SanctionsApiResponse {
    return {
      data: [],
      total: 0,
      pagination: {
        limit: 20,
        offset: (currentPage - 1) * 20,
        count: 0,
        total: 0,
        current_page: currentPage,
        total_pages: 0,
        has_next: false,
        has_prev: currentPage > 1,
      },
    };
  }

  private initialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }

  private fullName(student: StudentsApiItem): string {
    return `${student.first_name} ${student.last_name}`.trim();
  }

  private formatDate(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  }

  private toErrorMessage(error: unknown, fallbackKey: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t(fallbackKey);
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return this.i18n.t(fallbackKey);
  }
}
