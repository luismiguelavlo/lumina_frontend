import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LumButtonComponent } from '../../atoms/lum-button/lum-button.component';
import { LumCheckboxComponent } from '../../atoms/lum-checkbox/lum-checkbox.component';
import { LumTextLinkComponent } from '../../atoms/lum-text-link/lum-text-link.component';
import { LumGlassCardComponent } from '../../molecules/lum-glass-card/lum-glass-card.component';
import { LumTextFieldComponent } from '../../molecules/lum-text-field/lum-text-field.component';

@Component({
  selector: 'app-lum-login-form',
  imports: [
    ReactiveFormsModule,
    LumGlassCardComponent,
    LumTextFieldComponent,
    LumCheckboxComponent,
    LumButtonComponent,
    LumTextLinkComponent,
  ],
  templateUrl: './lum-login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoginFormComponent {
  readonly form = input.required<FormGroup>();
  readonly submitted = output<void>();

  readonly cardTitle = input.required<string>();
  readonly emailLabel = input.required<string>();
  readonly emailPlaceholder = input.required<string>();
  readonly passwordLabel = input.required<string>();
  readonly passwordPlaceholder = input.required<string>();
  readonly rememberLabel = input.required<string>();
  readonly loginLabel = input.required<string>();
  readonly footerPrompt = input.required<string>();
  readonly footerCtaLabel = input.required<string>();
  readonly errorMessage = input<string | null>(null);
  readonly isSubmitting = input(false);

  readonly forgotPasswordHref = input('#');
  readonly requestAccessHref = input('#');

  readonly emailFieldId = input('login-email');
  readonly passwordFieldId = input('login-password');
  readonly rememberFieldId = input('login-remember');

  protected readonly emailControl = computed(
    () => this.form().get('email') as FormControl<string | null>,
  );
  protected readonly passwordControl = computed(
    () => this.form().get('password') as FormControl<string | null>,
  );
  protected readonly rememberControl = computed(
    () => this.form().get('remember') as FormControl<boolean>,
  );

  protected readonly forgotLink = computed(() => ({
    href: this.forgotPasswordHref(),
    label: 'Forgot password?',
  }));

  protected handleSubmit(): void {
    const group = this.form();
    if (group.invalid || this.isSubmitting()) {
      group.markAllAsTouched();
      return;
    }
    this.submitted.emit();
  }
}
