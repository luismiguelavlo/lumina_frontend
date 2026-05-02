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
import type { FineRow, FineStatusFilter } from '../../../../shared/models/fine-row.model';
import type { FinesApiPagination, FinesApiResponse } from '../../../../shared/models/fines-api.model';
import type { StudentsApiItem } from '../../../../shared/models/students-api.model';
import { FinesApiService } from '../../../../shared/data-access/fines-api.service';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import { LumFinesFiltersBarComponent } from '../../../../shared/ui/organisms/lum-fines-filters-bar/lum-fines-filters-bar.component';
import { LumFinesTableComponent } from '../../../../shared/ui/organisms/lum-fines-table/lum-fines-table.component';
import { LumConfirmActionModalComponent } from '../../../../shared/ui/organisms/lum-confirm-action-modal/lum-confirm-action-modal.component';

@Component({
  selector: 'app-fines-management-page',
  imports: [LumFinesFiltersBarComponent, LumFinesTableComponent, LumConfirmActionModalComponent],
  templateUrl: './fines-management.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesManagementPage {
  private readonly finesApi = inject(FinesApiService);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly currentPage = signal(1);
  private readonly refreshNonce = signal(0);

  protected readonly pageTitle = 'Fines';
  protected readonly pageSubtitle = 'Loan-related fine management';

  protected readonly statusFilter = signal<FineStatusFilter>('pending');
  protected readonly studentQuery = signal('');
  protected readonly selectedStudent = signal<StudentsApiItem | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isStudentLookupLoading = signal(false);
  protected readonly isMutatingFine = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly actionSuccess = signal<string | null>(null);
  protected readonly pendingFineAction = signal<{ type: 'paid' | 'waived'; row: FineRow } | null>(null);

  private readonly studentLookupQuery = toSignal(
    toObservable(this.studentQuery).pipe(startWith(''), debounceTime(250), distinctUntilChanged()),
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

  private readonly finesResponse = toSignal(
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
        return this.finesApi
          .listFines({
            limit: 20,
            offset: (page - 1) * 20,
            student_id: studentId ?? undefined,
          })
          .pipe(
            catchError((error: unknown) => {
              this.loadError.set(this.toErrorMessage(error));
              return of(this.emptyResponse(page));
            }),
            finalize(() => this.isLoading.set(false)),
          );
      }),
    ),
    { initialValue: this.emptyResponse(1) },
  );

  protected readonly filteredRows = computed((): readonly FineRow[] => {
    const status = this.statusFilter();
    return this.finesResponse()
      .data.map((row) => {
        const studentName = row.student_name ?? 'Unknown student';
        return {
          id: row.id,
          studentName,
          studentIdDisplay: row.student_id,
          initials: this.initialsFromName(studentName),
          amountLabel: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(row.amount ?? 0),
          status: this.mapStatus(row.status),
          reason: (row.reason ?? 'No details').slice(0, 120),
          reasonTitle: row.reason ?? 'No details',
        } satisfies FineRow;
      })
      .filter((row) => row.status === status);
  });

  protected readonly pagination = computed<FinesApiPagination>(() => this.finesResponse().pagination);

  protected onFilterChange(value: FineStatusFilter): void {
    this.statusFilter.set(value);
    this.actionSuccess.set(null);
  }

  protected onStudentQueryChange(value: string): void {
    this.studentQuery.set(value);
    this.actionSuccess.set(null);
    if (this.selectedStudent() && value !== this.fullName(this.selectedStudent()!)) {
      this.selectedStudent.set(null);
      this.currentPage.set(1);
    }
  }

  protected pickStudent(student: StudentsApiItem): void {
    this.selectedStudent.set(student);
    this.studentQuery.set(this.fullName(student));
    this.actionSuccess.set(null);
    this.currentPage.set(1);
  }

  protected clearSelectedStudent(): void {
    this.selectedStudent.set(null);
    this.studentQuery.set('');
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

  protected onMarkPaid(row: FineRow): void {
    if (row.status !== 'pending' || this.isMutatingFine()) return;
    this.pendingFineAction.set({ type: 'paid', row });
  }

  protected onMarkWaived(row: FineRow): void {
    if (row.status !== 'pending' || this.isMutatingFine()) return;
    this.pendingFineAction.set({ type: 'waived', row });
  }

  protected cancelFineAction(): void {
    if (this.isMutatingFine()) return;
    this.pendingFineAction.set(null);
  }

  protected confirmFineAction(): void {
    const pending = this.pendingFineAction();
    if (!pending || this.isMutatingFine()) return;

    this.isMutatingFine.set(true);
    this.loadError.set(null);
    this.actionSuccess.set(null);
    const request =
      pending.type === 'paid'
        ? this.finesApi.markFinePaid(pending.row.id)
        : this.finesApi.markFineWaived(pending.row.id);
    request
      .pipe(
        take(1),
        finalize(() => this.isMutatingFine.set(false)),
      )
      .subscribe({
        next: () => {
          this.actionSuccess.set(
            pending.type === 'paid'
              ? `Fine ${pending.row.id} marked as paid.`
              : `Fine ${pending.row.id} marked as waived.`,
          );
          this.pendingFineAction.set(null);
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.loadError.set(this.toErrorMessage(error));
        },
      });
  }

  private emptyResponse(currentPage: number): FinesApiResponse {
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

  private mapStatus(status: string): FineStatusFilter {
    return status === 'paid' || status === 'waived' ? status : 'pending';
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

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Could not load fines.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return 'Could not load fines.';
  }
}
