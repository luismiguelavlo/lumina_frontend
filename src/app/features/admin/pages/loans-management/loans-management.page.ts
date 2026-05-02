import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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
import type { LoanRow } from '../../../../shared/models/loan-row.model';
import type { LoansApiPagination, LoansApiResponse } from '../../../../shared/models/loans-api.model';
import type { StudentsApiItem } from '../../../../shared/models/students-api.model';
import { LoansApiService } from '../../../../shared/data-access/loans-api.service';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import { LumIconComponent } from '../../../../shared/ui/atoms/lum-icon/lum-icon.component';
import { LumLoansTableComponent } from '../../../../shared/ui/organisms/lum-loans-table/lum-loans-table.component';
import { LumStudentsNeoSearchComponent } from '../../../../shared/ui/molecules/lum-students-neo-search/lum-students-neo-search.component';

@Component({
  selector: 'app-loans-management-page',
  imports: [LumIconComponent, LumStudentsNeoSearchComponent, LumLoansTableComponent],
  templateUrl: './loans-management.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansManagementPage {
  private readonly router = inject(Router);
  private readonly loansApi = inject(LoansApiService);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly currentPage = signal(1);
  private readonly refreshNonce = signal(0);

  protected readonly pageTitle = 'Loan control panel';
  protected readonly pageSubtitle = 'Chronological list of active loans requiring attention';

  protected readonly searchQuery = signal('');
  protected readonly selectedStudent = signal<StudentsApiItem | null>(null);
  protected readonly searchError = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isStudentLookupLoading = signal(false);
  protected readonly returnActionError = signal<string | null>(null);
  protected readonly returnActionSuccess = signal<string | null>(null);
  protected readonly isReturning = signal(false);

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
          map((res) => res.data),
          map((rows) => rows.slice(0, 6)),
          catchError(() => of([] as readonly StudentsApiItem[])),
          finalize(() => this.isStudentLookupLoading.set(false)),
        );
      }),
    ),
    { initialValue: [] as readonly StudentsApiItem[] },
  );

  private readonly loansResponse = toSignal(
    toObservable(
      computed(() => ({
        page: this.currentPage(),
        studentId: this.selectedStudent()?.id ?? null,
        nonce: this.refreshNonce(),
      })),
    ).pipe(
      switchMap(({ page, studentId }) => {
        this.isLoading.set(true);
        this.searchError.set(null);
        return this.loansApi
          .listLoans({
            limit: 20,
            offset: (page - 1) * 20,
            student_id: studentId ?? undefined,
          })
          .pipe(
            catchError((error: unknown) => {
              this.searchError.set(this.toErrorMessage(error));
              return of(this.emptyResponse(page));
            }),
            finalize(() => this.isLoading.set(false)),
          );
      }),
    ),
    { initialValue: this.emptyResponse(1) },
  );

  protected readonly filteredRows = computed((): readonly LoanRow[] =>
    this.loansResponse().data.map((row) => {
      const borrowerName = row.borrower ?? row.borrower_name ?? 'Unknown borrower';
      const initials = this.initialsFromName(borrowerName);
      const dueDateRaw = row.due_date ?? '';
      const dueDate = this.formatDate(dueDateRaw);
      const daysLeft = typeof row.time_remaining === 'number' ? Math.max(0, Math.trunc(row.time_remaining)) : 0;
      return {
        id: row.loan_id,
        bookTitle: row.book_title ?? 'Untitled',
        loanIdLabel: `ID: #${row.loan_id}`,
        borrowerName,
        borrowerInitials: initials,
        dueIsToday: daysLeft === 0,
        dueDateLabel: dueDate,
        daysLeftLabel: `${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'} Left`,
        progressPercent: this.toProgressPercent(daysLeft),
        urgency: this.toUrgency(daysLeft),
      };
    }),
  );
  protected readonly pagination = computed<LoansApiPagination>(() => this.loansResponse().pagination);

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.returnActionSuccess.set(null);
    if (this.selectedStudent() && value !== this.fullName(this.selectedStudent()!)) {
      this.selectedStudent.set(null);
      this.currentPage.set(1);
    }
  }

  protected pickStudent(student: StudentsApiItem): void {
    this.selectedStudent.set(student);
    this.searchQuery.set(this.fullName(student));
    this.returnActionSuccess.set(null);
    this.currentPage.set(1);
  }

  protected clearSelectedStudent(): void {
    this.selectedStudent.set(null);
    this.searchQuery.set('');
    this.returnActionSuccess.set(null);
    this.currentPage.set(1);
  }

  protected onRenew(row: LoanRow): void {
    if (this.isReturning()) return;
    this.isReturning.set(true);
    this.returnActionError.set(null);
    this.returnActionSuccess.set(null);
    this.loansApi
      .returnLoan(row.id)
      .pipe(
        take(1),
        finalize(() => this.isReturning.set(false)),
      )
      .subscribe({
        next: () => {
          this.returnActionSuccess.set(`Loan ${row.id} was returned successfully.`);
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => this.returnActionError.set(this.toErrorMessage(error)),
      });
  }

  protected onNewLoan(): void {
    void this.router.navigate(['/admin', 'loans', 'new']);
  }

  protected prevPage(): void {
    if (!this.pagination().has_prev) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  protected nextPage(): void {
    if (!this.pagination().has_next) return;
    this.currentPage.update((p) => p + 1);
  }

  private emptyResponse(currentPage: number): LoansApiResponse {
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

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  }

  private toUrgency(daysLeft: number): LoanRow['urgency'] {
    if (daysLeft <= 0) return 'critical';
    if (daysLeft <= 3) return 'warning';
    if (daysLeft <= 10) return 'safe';
    return 'very_safe';
  }

  private toProgressPercent(daysLeft: number): number {
    if (daysLeft <= 0) return 100;
    if (daysLeft <= 3) return 85;
    if (daysLeft <= 10) return 45;
    return 15;
  }

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Could not load loans.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return 'Could not load loans.';
  }
}
