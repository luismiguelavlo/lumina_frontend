import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);
  const authApi = inject(AuthApiService);

  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  const isRetryAttempt = req.headers.has('x-auth-retry');
  const accessToken = session.getValidAccessToken();

  const request = !isAuthEndpoint && accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (isAuthEndpoint || isRetryAttempt) {
        session.clearSession();
        void router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      const refreshToken = session.getValidRefreshToken();
      if (!refreshToken) {
        session.clearSession();
        void router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      return authApi.refresh(refreshToken).pipe(
        switchMap((auth) => {
          session.saveSession({
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
          }, auth.user);

          const retried = req.clone({
            setHeaders: {
              Authorization: `Bearer ${auth.accessToken}`,
              'x-auth-retry': '1',
            },
          });

          return next(retried);
        }),
        catchError((refreshError: unknown) => {
          session.clearSession();
          void router.navigate(['/auth/login']);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
