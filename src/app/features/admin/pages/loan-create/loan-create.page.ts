import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import type { LoanCreateBookOption, LoanCreateStudentOption } from '../../../../shared/models/loan-create.models';
import { PublicBooksApiService } from '../../../../shared/data-access/public-books-api.service';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import { LoansApiService } from '../../../../shared/data-access/loans-api.service';
import { LumIconComponent } from '../../../../shared/ui/atoms/lum-icon/lum-icon.component';
import { LumLoanCreateBookPickListComponent } from '../../../../shared/ui/molecules/lum-loan-create-book-pick-list/lum-loan-create-book-pick-list.component';
import { LumLoanCreateDueFieldComponent } from '../../../../shared/ui/molecules/lum-loan-create-due-field/lum-loan-create-due-field.component';
import { LumLoanCreateIconSearchComponent } from '../../../../shared/ui/molecules/lum-loan-create-icon-search/lum-loan-create-icon-search.component';
import { LumLoanCreateSectionHeadingComponent } from '../../../../shared/ui/molecules/lum-loan-create-section-heading/lum-loan-create-section-heading.component';
import { LumLoanCreateSelectedBookCardComponent } from '../../../../shared/ui/molecules/lum-loan-create-selected-book-card/lum-loan-create-selected-book-card.component';
import { LumLoanCreateSelectedStudentCardComponent } from '../../../../shared/ui/molecules/lum-loan-create-selected-student-card/lum-loan-create-selected-student-card.component';
import { LumLoanCreateStudentPickListComponent } from '../../../../shared/ui/molecules/lum-loan-create-student-pick-list/lum-loan-create-student-pick-list.component';
import type { CreateLoanBusinessMessageResponse } from '../../../../shared/models/loans-api.model';

function isoDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-loan-create-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    LumIconComponent,
    LumLoanCreateBookPickListComponent,
    LumLoanCreateDueFieldComponent,
    LumLoanCreateIconSearchComponent,
    LumLoanCreateSectionHeadingComponent,
    LumLoanCreateSelectedBookCardComponent,
    LumLoanCreateSelectedStudentCardComponent,
    LumLoanCreateStudentPickListComponent,
  ],
  templateUrl: './loan-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly booksApi = inject(PublicBooksApiService);
  private readonly loansApi = inject(LoansApiService);

  protected readonly pageTitle = 'New loan registration';
  protected readonly pageSubtitle = 'Complete the information to finalize the loan.';

  protected readonly studentQuery = signal('');
  protected readonly bookQuery = signal('');
  protected readonly selectedStudent = signal<LoanCreateStudentOption | null>(null);
  protected readonly selectedBook = signal<LoanCreateBookOption | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly showSuccessModal = signal(false);
  protected readonly successMessage = signal('Loan registered successfully.');

  protected readonly form = this.fb.nonNullable.group({
    dueDate: this.fb.nonNullable.control(isoDatePlusDays(0), [Validators.required]),
  });

  private readonly studentSearch = toSignal(
    toObservable(this.studentQuery).pipe(startWith(''), debounceTime(250), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly filteredStudents = toSignal(
    toObservable(this.studentSearch).pipe(
      switchMap((query) => {
        const q = query.trim();
        if (!q || this.selectedStudent()) {
          return of([] as readonly LoanCreateStudentOption[]);
        }
        return this.studentsApi.listStudents({ limit: 20, offset: 0, search: q }).pipe(
          map((response) =>
            response.data.map((student) => ({
              id: student.student_id_code || student.id,
              studentId: student.id,
              name: `${student.first_name} ${student.last_name}`.trim(),
              avatarUrl:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
              avatarAlt: `Portrait of ${student.first_name} ${student.last_name}`,
              statusLabel: student.is_active ? 'Active' : 'Inactive',
            })),
          ),
          map((rows) => rows.slice(0, 5)),
          catchError(() => of([] as readonly LoanCreateStudentOption[])),
        );
      }),
    ),
    { initialValue: [] as readonly LoanCreateStudentOption[] },
  );

  private readonly bookSearch = toSignal(
    toObservable(this.bookQuery).pipe(startWith(''), debounceTime(250), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly filteredBooks = toSignal(
    toObservable(this.bookSearch).pipe(
      switchMap((query) => {
        const q = query.trim();
        if (!q || this.selectedBook()) {
          return of([] as readonly LoanCreateBookOption[]);
        }
        return this.booksApi.listBooks({ limit: 20, offset: 0, search: q }).pipe(
          map((response) =>
            response.data.map((book) => ({
              id: book.isbn || book.id,
              bookId: book.id,
              title: book.title,
              author: book.author,
              isbn: book.isbn ?? 'N/A',
              coverUrl:
                book.cover_url ||
                'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=320&q=80',
              coverAlt: `Book cover: ${book.title}`,
            })),
          ),
          map((rows) => rows.slice(0, 5)),
          catchError(() => of([] as readonly LoanCreateBookOption[])),
        );
      }),
    ),
    { initialValue: [] as readonly LoanCreateBookOption[] },
  );

  protected onStudentQuery(value: string): void {
    this.studentQuery.set(value);
  }

  protected onBookQuery(value: string): void {
    this.bookQuery.set(value);
  }

  protected pickStudent(s: LoanCreateStudentOption): void {
    this.selectedStudent.set(s);
    this.studentQuery.set('');
    this.saveError.set(null);
  }

  protected pickBook(b: LoanCreateBookOption): void {
    this.selectedBook.set(b);
    this.bookQuery.set('');
    this.saveError.set(null);
  }

  protected clearStudent(): void {
    this.selectedStudent.set(null);
  }

  protected clearBook(): void {
    this.selectedBook.set(null);
  }

  protected cancel(): void {
    void this.router.navigate(['/admin', 'loans']);
  }

  protected registerLoan(): void {
    const student = this.selectedStudent();
    const book = this.selectedBook();
    if (!student || !book) {
      this.saveError.set('Please select both a student and a book before registering the loan.');
      return;
    }
    if (this.form.controls.dueDate.invalid) {
      this.saveError.set('Please provide a valid due date.');
      return;
    }

    const studentId = student.studentId ?? student.id;
    const bookId = book.bookId ?? book.id;
    if (!studentId || !bookId) {
      this.saveError.set('Could not resolve student/book IDs. Please reselect both entries.');
      return;
    }
    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    this.loansApi
      .createLoan({
        student_id: studentId,
        book_id: bookId,
        due_date: this.form.controls.dueDate.value,
      })
      .pipe(
        take(1),
        finalize(() => this.isSaving.set(false)),
      )
      .subscribe({
        next: (response) => {
          const body = response.body;
          if (body && 'message' in body && !(body as { loan_id?: string }).loan_id) {
            this.saveError.set((body as CreateLoanBusinessMessageResponse).message);
            return;
          }
          const loanId =
            body && 'loan_id' in body && typeof body.loan_id === 'string' ? body.loan_id : null;
          this.successMessage.set(
            loanId ? `Loan ${loanId} was registered successfully.` : 'Loan was registered successfully.',
          );
          this.showSuccessModal.set(true);
        },
        error: (error: unknown) => {
          this.saveError.set(this.toErrorMessage(error));
        },
      });
  }

  protected confirmSuccessAndBackToLoans(): void {
    this.showSuccessModal.set(false);
    void this.router.navigate(['/admin', 'loans']);
  }

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No fue posible registrar el prestamo.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return 'No fue posible registrar el prestamo.';
  }
}
