import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-loan-due-display',
  imports: [],
  templateUrl: './lum-loan-due-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanDueDisplayComponent {
  readonly dueIsToday = input(false);
  /** Due date copy when not due today (e.g. "Oct 28, 2023"). */
  readonly dateLabel = input<string>('');
}
