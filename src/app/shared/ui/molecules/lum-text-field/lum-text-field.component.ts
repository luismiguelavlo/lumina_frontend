import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LumFieldLabelComponent } from '../../atoms/lum-field-label/lum-field-label.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumTextLinkComponent } from '../../atoms/lum-text-link/lum-text-link.component';

export interface LumAuxiliaryLink {
  readonly href: string;
  readonly label: string;
}

@Component({
  selector: 'app-lum-text-field',
  imports: [ReactiveFormsModule, LumFieldLabelComponent, LumIconComponent, LumTextLinkComponent],
  templateUrl: './lum-text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumTextFieldComponent {
  readonly control = input.required<FormControl<string | null>>();
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);
  readonly leadingIcon = input.required<string>();
  readonly inputKind = input<'email' | 'text' | 'password'>('text');
  readonly auxiliaryLink = input<LumAuxiliaryLink | null>(null);
  readonly showPasswordToggle = input(false);

  protected readonly passwordVisible = signal(false);

  protected readonly resolvedInputType = computed(() => {
    if (this.inputKind() !== 'password') {
      return this.inputKind();
    }
    return this.passwordVisible() ? 'text' : 'password';
  });

  protected readonly toggleIcon = computed(() =>
    this.passwordVisible() ? 'visibility' : 'visibility_off',
  );

  protected togglePasswordVisibility(): void {
    if (!this.showPasswordToggle()) {
      return;
    }
    this.passwordVisible.update((v) => !v);
  }
}
