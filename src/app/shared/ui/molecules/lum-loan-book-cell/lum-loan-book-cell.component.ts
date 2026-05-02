import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-loan-book-cell',
  imports: [],
  templateUrl: './lum-loan-book-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanBookCellComponent {
  readonly title = input.required<string>();
  readonly loanIdLabel = input.required<string>();
}
