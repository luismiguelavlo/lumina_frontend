import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { I18nService } from '../../../i18n/i18n.service';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-students-neo-search',
  imports: [LumIconComponent],
  templateUrl: './lum-students-neo-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentsNeoSearchComponent {
  private readonly i18n = inject(I18nService);

  readonly placeholder = input.required<string>();
  readonly query = input<string>('');
  readonly ariaLabel = input<string | null>(null);

  readonly queryChange = output<string>();

  protected readonly resolvedAriaLabel = computed(() => {
    this.i18n.locale();
    return this.ariaLabel() ?? this.i18n.t('students.searchAria');
  });

  protected onInput(value: string): void {
    this.queryChange.emit(value);
  }
}
