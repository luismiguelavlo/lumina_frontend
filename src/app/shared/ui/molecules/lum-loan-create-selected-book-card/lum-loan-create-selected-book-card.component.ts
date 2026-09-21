import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LoanCreateBookOption } from '../../../models/loan-create.models';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-loan-create-selected-book-card',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-loan-create-selected-book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateSelectedBookCardComponent {
  readonly book = input.required<LoanCreateBookOption>();

  readonly clearClick = output<void>();

  protected clear(): void {
    this.clearClick.emit();
  }
}
