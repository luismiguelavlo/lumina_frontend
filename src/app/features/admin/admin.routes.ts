import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from '../auth/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    loadComponent: () => import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-overview/dashboard-overview.page').then((m) => m.DashboardOverviewPage),
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./pages/activity-history/activity-history.page').then((m) => m.ActivityHistoryPage),
      },
      {
        path: 'books/:bookId',
        loadComponent: () =>
          import('./pages/book-detail/book-detail.page').then((m) => m.BookDetailPage),
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./pages/books-catalog/books-catalog.page').then((m) => m.BooksCatalogPage),
      },
      { path: 'users', pathMatch: 'full', redirectTo: 'students' },
      {
        path: 'students/:patronId',
        loadComponent: () =>
          import('./pages/student-detail/student-detail.page').then((m) => m.StudentDetailPage),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/students-management/students-management.page').then((m) => m.StudentsManagementPage),
      },
      {
        path: 'fines',
        loadComponent: () =>
          import('./pages/fines-management/fines-management.page').then((m) => m.FinesManagementPage),
      },
      {
        path: 'sanctions',
        loadComponent: () =>
          import('./pages/sanctions-management/sanctions-management.page').then((m) => m.SanctionsManagementPage),
      },
      {
        path: 'loans/new',
        loadComponent: () => import('./pages/loan-create/loan-create.page').then((m) => m.LoanCreatePage),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./pages/loans-management/loans-management.page').then((m) => m.LoansManagementPage),
      },
    ],
  },
];
