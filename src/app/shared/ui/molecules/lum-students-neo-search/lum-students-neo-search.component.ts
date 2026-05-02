import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-students-neo-search',
  imports: [LumIconComponent],
  templateUrl: './lum-students-neo-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentsNeoSearchComponent {
  readonly placeholder = input.required<string>();
  readonly query = input<string>('');
  readonly ariaLabel = input<string>('Search students');

  readonly queryChange = output<string>();

  protected onInput(value: string): void {
    this.queryChange.emit(value);
  }
}
