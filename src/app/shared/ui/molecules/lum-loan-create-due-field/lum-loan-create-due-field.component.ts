import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from '../../../i18n/i18n.service';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-loan-create-due-field',
  imports: [ReactiveFormsModule, LumIconComponent],
  templateUrl: './lum-loan-create-due-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateDueFieldComponent {
  private readonly i18n = inject(I18nService);

  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly control = input.required<FormControl<string>>();

  protected readonly resolvedLabel = computed(() => {
    this.i18n.locale();
    return this.label() ?? this.i18n.t('loanCreate.due.label');
  });

  protected readonly resolvedHint = computed(() => {
    this.i18n.locale();
    return this.hint() ?? this.i18n.t('loanCreate.due.hint');
  });
}
