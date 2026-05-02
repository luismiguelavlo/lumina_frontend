import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LoanRow } from '../../../models/loan-row.model';
import type { LoansApiPagination } from '../../../models/loans-api.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumLoanBookCellComponent } from '../../molecules/lum-loan-book-cell/lum-loan-book-cell.component';
import { LumLoanCountdownBarComponent } from '../../molecules/lum-loan-countdown-bar/lum-loan-countdown-bar.component';
import { LumLoanDueDisplayComponent } from '../../molecules/lum-loan-due-display/lum-loan-due-display.component';
import { LumTableStudentIdentityCellComponent } from '../../molecules/lum-table-student-identity-cell/lum-table-student-identity-cell.component';

@Component({
  selector: 'app-lum-loans-table',
  imports: [
    LumIconComponent,
    LumLoanBookCellComponent,
    LumLoanCountdownBarComponent,
    LumLoanDueDisplayComponent,
    LumTableStudentIdentityCellComponent,
  ],
  templateUrl: './lum-loans-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoansTableComponent {
  readonly rows = input.required<readonly LoanRow[]>();
  readonly pagination = input<LoansApiPagination | null>(null);

  readonly renewClick = output<LoanRow>();
  readonly prevPageClick = output<void>();
  readonly nextPageClick = output<void>();

  protected onRenew(row: LoanRow): void {
    this.renewClick.emit(row);
  }

  protected onPrevPage(): void {
    this.prevPageClick.emit();
  }

  protected onNextPage(): void {
    this.nextPageClick.emit();
  }
}
