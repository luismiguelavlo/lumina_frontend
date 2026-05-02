import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'rankings',
    title: 'Ranking de reputación',
    loadComponent: () =>
      import('./features/public-rankings/public-rankings.page').then((m) => m.PublicRankingsPage),
  },
  {
    path: 'catalog',
    title: 'Student book catalog – Lumina Archive',
    loadComponent: () =>
      import('./features/public-catalog/public-catalog.page').then((m) => m.PublicCatalogPage),
  },
  {
    path: 'catalog/:bookId',
    loadComponent: () =>
      import('./features/public-catalog/public-book-detail.page').then((m) => m.PublicBookDetailPage),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
