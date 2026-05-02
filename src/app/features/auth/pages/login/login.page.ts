import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiError, AuthApiService } from '../../data-access/auth-api.service';
import { AuthSessionService } from '../../data-access/auth-session.service';
import { LumAuthBrandComponent } from '../../../../shared/ui/organisms/lum-auth-brand/lum-auth-brand.component';
import { LumLoginFormComponent } from '../../../../shared/ui/organisms/lum-login-form/lum-login-form.component';
import { LumAuthShellComponent } from '../../../../shared/ui/templates/lum-auth-shell/lum-auth-shell.component';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, LumAuthShellComponent, LumAuthBrandComponent, LumLoginFormComponent],
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly footerPrompt = "Don't have an account?";
  protected readonly loginErrorMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', Validators.required),
    remember: this.fb.control<boolean>(false),
  });

  protected readonly loginButtonLabel = computed(() =>
    this.isSubmitting() ? 'Signing in...' : 'Login',
  );

  protected async onSubmitted(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loginErrorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      const payload = this.form.getRawValue();
      const auth = await firstValueFrom(this.authApi.login(payload));
      this.authSession.saveSession({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
      }, auth.user);

      const redirectCandidate = this.route.snapshot.queryParamMap.get('redirectUrl');
      const redirectTarget =
        redirectCandidate && redirectCandidate.startsWith('/') ? redirectCandidate : '/admin';

      await this.router.navigateByUrl(redirectTarget);
    } catch (error) {
      const message =
        error instanceof AuthApiError
          ? error.message
          : 'Ocurrio un error inesperado al iniciar sesion. Intenta nuevamente.';
      this.loginErrorMessage.set(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
