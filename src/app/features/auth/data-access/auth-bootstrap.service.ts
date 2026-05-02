import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApiError, AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class AuthBootstrapService {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);

  async initialize(): Promise<void> {
    if (!this.authSession.hasValidSession()) {
      this.authSession.clearSession();
      return;
    }

    try {
      const user = await firstValueFrom(this.authApi.me());
      this.authSession.setUser(user);
    } catch (error) {
      if (
        error instanceof AuthApiError &&
        (error.code === 'invalid_token' || error.code === 'user_not_found')
      ) {
        this.authSession.clearSession();
      }
    }
  }
}
