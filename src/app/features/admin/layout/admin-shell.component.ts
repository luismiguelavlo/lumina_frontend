import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { AdminNavItemModel } from '../../../shared/models/dashboard.models';
import { AuthApiError, AuthApiService } from '../../auth/data-access/auth-api.service';
import { AuthSessionService } from '../../auth/data-access/auth-session.service';
import { LumIconComponent } from '../../../shared/ui/atoms/lum-icon/lum-icon.component';
import { LumAdminSidebarComponent } from '../../../shared/ui/organisms/lum-admin-sidebar/lum-admin-sidebar.component';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, LumAdminSidebarComponent, LumIconComponent],
  templateUrl: './admin-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellComponent {
  protected readonly sidebarOpen = signal(false);

  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.sidebarOpen.set(false));
  }

  @HostListener('document:keydown.escape')
  protected onEscapeCloseDrawer(): void {
    if (this.sidebarOpen()) {
      this.sidebarOpen.set(false);
    }
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected readonly navItems: readonly AdminNavItemModel[] = [
    { path: '/admin/dashboard', label: 'Overview', icon: 'dashboard', exact: true },
    { path: '/admin/books', label: 'Books', icon: 'book' },
    { path: '/admin/students', label: 'Students', icon: 'school' },
    { path: '/admin/fines', label: 'Fines', icon: 'payments' },
    { path: '/admin/sanctions', label: 'Sanctions', icon: 'gavel' },
    { path: '/admin/loans', label: 'Loans', icon: 'contract' },
  ];

  protected readonly userProfile = {
    name: this.authSession.user()
      ? `${this.authSession.user()?.first_name ?? ''} ${this.authSession.user()?.last_name ?? ''}`.trim()
      : 'Librarian',
    role: this.authSession.user()?.role ?? 'library_staff',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCElwiBj6bDh6i5LRIgymQJMFPgt7A_tgaGksBCK7wJ6q8nlkLD4w6KTlCUSjjRuzwFva9Tc1YTpmHom3uAQX-RaY1C5wnLQ3EWBJGscY4BOFanlSX2oHcA97NCS6Nr2a7jkiB5j8Qhg5eZ-Os859xLD9ItKHD_sTjyYU0gyBDZZNdTWH9nvOmWM_l-WAlv6RZHhGXeux4TGPjuLGFRUcrLmJ8qU5nVgHFiNfgmsKwgXMOeyPdrafpRej8PMO968UBPE4N_6q5mLBc',
    avatarAlt: 'Portrait of an admin user',
  };

  protected async onLogoutRequested(): Promise<void> {
    try {
      await firstValueFrom(this.authApi.logout());
    } catch (error) {
      // If token is already invalid (401), we still enforce local logout.
      if (!(error instanceof AuthApiError && error.code === 'invalid_token')) {
        console.warn('Logout endpoint failed, forcing local logout.', error);
      }
    } finally {
      this.authSession.clearSession();
      await this.router.navigate(['/auth/login']);
    }
  }
}
