import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionService } from '../data-access/auth-session.service';

const buildLoginRedirect = (targetUrl: string) => {
  const router = inject(Router);
  return router.createUrlTree(['/auth/login'], {
    queryParams: { redirectUrl: targetUrl },
  });
};

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(AuthSessionService);
  if (session.isAuthenticated()) {
    return true;
  }

  return buildLoginRedirect(state.url);
};

export const authChildGuard: CanActivateChildFn = (_route, state) => {
  const session = inject(AuthSessionService);
  if (session.isAuthenticated()) {
    return true;
  }

  return buildLoginRedirect(state.url);
};
