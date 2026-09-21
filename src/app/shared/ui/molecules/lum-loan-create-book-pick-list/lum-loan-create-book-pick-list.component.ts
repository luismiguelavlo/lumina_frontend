import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LoanCreateBookOption } from '../../../models/loan-create.models';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-lum-loan-create-book-pick-list',
  imports: [TranslatePipe],
  templateUrl: './lum-loan-create-book-pick-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateBookPickListComponent {
  readonly options = input.required<readonly LoanCreateBookOption[]>();

  readonly pick = output<LoanCreateBookOption>();
}
