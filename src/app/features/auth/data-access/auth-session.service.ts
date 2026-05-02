import { computed, Injectable, signal } from '@angular/core';
import type { AuthUser } from './auth-api.service';

const ACCESS_TOKEN_STORAGE_KEY = 'lumina.auth.access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'lumina.auth.refresh_token';

export interface SessionTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly accessTokenState = signal<string | null>(this.readTokenFromStorage(ACCESS_TOKEN_STORAGE_KEY));
  private readonly refreshTokenState = signal<string | null>(
    this.readTokenFromStorage(REFRESH_TOKEN_STORAGE_KEY),
  );
  private readonly userState = signal<AuthUser | null>(null);

  readonly accessToken = computed(() => this.accessTokenState());
  readonly refreshToken = computed(() => this.refreshTokenState());
  readonly user = computed(() => this.userState());
  readonly isAuthenticated = computed(
    () =>
      this.isTokenUsable(this.accessTokenState()) || this.isTokenUsable(this.refreshTokenState()),
  );

  saveSession(tokens: SessionTokens, user?: AuthUser): void {
    if (!tokens.accessToken || !tokens.refreshToken) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    this.accessTokenState.set(tokens.accessToken);
    this.refreshTokenState.set(tokens.refreshToken);
    if (user) {
      this.userState.set(user);
    }
  }

  setUser(user: AuthUser | null): void {
    this.userState.set(user);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.userState.set(null);
  }

  getValidAccessToken(): string | null {
    const token = this.accessTokenState();
    if (!this.isTokenUsable(token)) {
      this.accessTokenState.set(null);
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      return null;
    }

    return token;
  }

  getValidRefreshToken(): string | null {
    const token = this.refreshTokenState();
    if (!this.isTokenUsable(token)) {
      this.refreshTokenState.set(null);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      return null;
    }

    return token;
  }

  hasValidSession(): boolean {
    return this.isTokenUsable(this.accessTokenState()) || this.isTokenUsable(this.refreshTokenState());
  }

  private readTokenFromStorage(storageKey: string): string | null {
    const token = localStorage.getItem(storageKey);
    return this.isTokenUsable(token) ? token : null;
  }

  private isTokenUsable(token: string | null): token is string {
    if (!token) {
      return false;
    }

    const expiresAt = this.extractTokenExpirationMs(token);
    if (expiresAt === null) {
      // If token has no exp claim, treat as usable.
      return true;
    }

    return Date.now() < expiresAt;
  }

  private extractTokenExpirationMs(token: string): number | null {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payloadJson = atob(padded);
      const payload = JSON.parse(payloadJson) as { exp?: unknown };

      if (typeof payload.exp !== 'number') {
        return null;
      }

      return payload.exp * 1000;
    } catch {
      return null;
    }
  }
}
