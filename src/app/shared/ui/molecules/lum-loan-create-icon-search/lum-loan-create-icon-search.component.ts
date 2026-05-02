import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-loan-create-icon-search',
  imports: [LumIconComponent],
  templateUrl: './lum-loan-create-icon-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateIconSearchComponent {
  readonly icon = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly ariaLabel = input.required<string>();
  readonly query = input<string>('');

  readonly queryChange = output<string>();

  protected onInput(value: string): void {
    this.queryChange.emit(value);
  }
}
