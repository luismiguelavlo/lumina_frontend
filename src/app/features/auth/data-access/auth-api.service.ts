import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly access_token?: string;
  readonly refresh_token?: string;
  readonly expires_in?: number;
  readonly user?: {
    readonly id: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly role: string;
    readonly is_active: boolean;
    readonly created_at: string;
  };
  readonly message?: string;
}

export interface RefreshResponse {
  readonly access_token?: string;
  readonly refresh_token?: string;
  readonly expires_in?: number;
  readonly user?: LoginResponse['user'];
  readonly message?: string;
}

export interface LoginSuccess {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn?: number;
  readonly user?: AuthUser;
}

export type AuthApiErrorCode =
  | 'invalid_credentials'
  | 'invalid_token'
  | 'user_not_found'
  | 'network_error'
  | 'server_error'
  | 'unexpected_error';

export interface AuthUser {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly role: string;
  readonly is_active: boolean;
  readonly created_at: string;
}

export class AuthApiError extends Error {
  constructor(
    readonly code: AuthApiErrorCode,
    message: string,
    readonly sourceError?: unknown,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = `${environment.apiBaseUrl}/auth/login`;
  private readonly refreshUrl = `${environment.apiBaseUrl}/auth/refresh`;
  private readonly meUrl = `${environment.apiBaseUrl}/auth/me`;
  private readonly logoutUrl = `${environment.apiBaseUrl}/auth/logout`;

  login(payload: LoginPayload): Observable<LoginSuccess> {
    return this.http.post<LoginResponse>(this.loginUrl, payload).pipe(
      map((response) => this.normalizeAuthSuccess(response)),
      catchError((error: unknown) => {
        if (error instanceof AuthApiError) {
          return throwError(() => error);
        }

        if (!(error instanceof HttpErrorResponse)) {
          return throwError(
            () =>
              new AuthApiError(
                'unexpected_error',
                'No se pudo iniciar sesion. Verifica tus datos e intenta otra vez.',
                error,
              ),
          );
        }

        const backendMessage = this.extractBackendMessage(error);

        if (error.status === 401 || backendMessage === 'Credenciales invalidas') {
          return throwError(
            () => new AuthApiError('invalid_credentials', 'Credenciales invalidas', error),
          );
        }

        if (error.status === 0) {
          return throwError(
            () =>
              new AuthApiError(
                'network_error',
                'No fue posible conectar con el servidor. Intenta nuevamente.',
                error,
              ),
          );
        }

        if (error.status >= 500) {
          return throwError(
            () =>
              new AuthApiError(
                'server_error',
                'El servidor presento un problema. Intenta de nuevo en unos minutos.',
                error,
              ),
          );
        }

        return throwError(
          () =>
            new AuthApiError(
              'unexpected_error',
              backendMessage ?? 'No se pudo iniciar sesion. Verifica tus datos e intenta otra vez.',
              error,
            ),
        );
      }),
    );
  }

  refresh(refreshToken: string): Observable<LoginSuccess> {
    return this.http
      .post<RefreshResponse>(this.refreshUrl, {
        refresh_token: refreshToken,
      })
      .pipe(
        map((response) => this.normalizeAuthSuccess(response)),
        catchError((error: unknown) => {
          if (error instanceof AuthApiError) {
            return throwError(() => error);
          }

          if (!(error instanceof HttpErrorResponse)) {
            return throwError(
              () =>
                new AuthApiError(
                  'unexpected_error',
                'No se pudo renovar la sesion. Inicia sesion nuevamente.',
                  error,
                ),
            );
          }

          const backendMessage = this.extractBackendMessage(error);

          if (error.status === 401 || error.status === 403) {
            return throwError(
              () =>
                new AuthApiError(
                  'invalid_credentials',
                  'Tu sesion expiro. Inicia sesion nuevamente.',
                  error,
                ),
            );
          }

          if (error.status === 0) {
            return throwError(
              () =>
                new AuthApiError(
                  'network_error',
                'No fue posible conectar con el servidor para renovar la sesion.',
                  error,
                ),
            );
          }

          if (error.status >= 500) {
            return throwError(
              () =>
                new AuthApiError(
                  'server_error',
                'El servidor presento un problema al renovar la sesion.',
                  error,
                ),
            );
          }

          return throwError(
            () =>
              new AuthApiError(
                'unexpected_error',
                backendMessage ?? 'No se pudo renovar la sesion. Inicia sesion nuevamente.',
                error,
              ),
          );
        }),
      );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.meUrl).pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(
            () =>
              new AuthApiError(
                'unexpected_error',
                'No fue posible obtener la informacion del usuario.',
                error,
              ),
          );
        }

        const backendMessage = this.extractBackendMessage(error);

        if (error.status === 401 || backendMessage === 'Token invalido') {
          return throwError(
            () =>
              new AuthApiError(
                'invalid_token',
                backendMessage ?? 'Token invalido',
                error,
              ),
          );
        }

        if (error.status === 404 || backendMessage === 'Usuario no encontrado') {
          return throwError(
            () =>
              new AuthApiError(
                'user_not_found',
                backendMessage ?? 'Usuario no encontrado',
                error,
              ),
          );
        }

        if (error.status === 0) {
          return throwError(
            () =>
              new AuthApiError(
                'network_error',
                'No fue posible conectar con el servidor para obtener el usuario.',
                error,
              ),
          );
        }

        if (error.status >= 500) {
          return throwError(
            () =>
              new AuthApiError(
                'server_error',
                'El servidor presento un problema al consultar el usuario.',
                error,
              ),
          );
        }

        return throwError(
          () =>
            new AuthApiError(
              'unexpected_error',
                backendMessage ?? 'No fue posible obtener el usuario actual.',
              error,
            ),
        );
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.logoutUrl, {}).pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(
            () =>
              new AuthApiError(
                'unexpected_error',
                'No fue posible cerrar sesion en el servidor.',
                error,
              ),
          );
        }

        const backendMessage = this.extractBackendMessage(error);

        if (error.status === 401 || backendMessage === 'Token invalido') {
          return throwError(
            () =>
              new AuthApiError(
                'invalid_token',
                backendMessage ?? 'Token invalido',
                error,
              ),
          );
        }

        if (error.status === 0) {
          return throwError(
            () =>
              new AuthApiError(
                'network_error',
                'No fue posible conectar con el servidor para cerrar sesion.',
                error,
              ),
          );
        }

        if (error.status >= 500) {
          return throwError(
            () =>
              new AuthApiError(
                'server_error',
                'El servidor presento un problema al cerrar sesion.',
                error,
              ),
          );
        }

        return throwError(
          () =>
            new AuthApiError(
              'unexpected_error',
              backendMessage ?? 'No fue posible cerrar sesion en este momento.',
              error,
            ),
        );
      }),
    );
  }

  private normalizeAuthSuccess(response: LoginResponse | RefreshResponse): LoginSuccess {
    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;

    if (!accessToken || !refreshToken) {
      throw new AuthApiError(
        'unexpected_error',
        'El backend no devolvio tokens validos para la sesion.',
        response,
      );
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: response.expires_in,
      user: response.user,
    };
  }

  private extractBackendMessage(error: HttpErrorResponse): string | null {
    if (!error.error || typeof error.error !== 'object') {
      return null;
    }

    const message = (error.error as { message?: unknown }).message;
    return typeof message === 'string' ? message : null;
  }
}
