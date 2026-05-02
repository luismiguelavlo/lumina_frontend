import { Routes } from '@angular/router';
import { guestOnlyGuard } from './guards/guest-only.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
