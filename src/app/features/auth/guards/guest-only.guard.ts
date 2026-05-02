import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthSessionService } from '../data-access/auth-session.service';

export const guestOnlyGuard: CanActivateFn = (route) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);

  if (!session.isAuthenticated()) {
    return true;
  }

  const redirectUrl = route.queryParamMap.get('redirectUrl');
  const target = redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : '/admin';
  return router.parseUrl(target);
};
