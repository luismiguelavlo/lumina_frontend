import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { AdminNavItemModel } from '../../../shared/models/dashboard.models';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { ThemeService } from '../../../shared/theme/theme.service';
import { AuthApiError, AuthApiService } from '../../auth/data-access/auth-api.service';
import { AuthSessionService } from '../../auth/data-access/auth-session.service';
import { LumIconComponent } from '../../../shared/ui/atoms/lum-icon/lum-icon.component';
import { LumAdminSidebarComponent } from '../../../shared/ui/organisms/lum-admin-sidebar/lum-admin-sidebar.component';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, LumAdminSidebarComponent, LumIconComponent, TranslatePipe],
  templateUrl: './admin-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellComponent {
  protected readonly sidebarOpen = signal(false);

  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);

  constructor() {
    // Ensure theme class is applied as soon as the admin shell mounts.
    this.theme.setTheme(this.theme.theme());
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.sidebarOpen.set(false));

    // Sync <html lang> on boot.
    this.i18n.setLocale(this.i18n.locale());
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

  protected readonly navItems = computed<readonly AdminNavItemModel[]>(() => {
    this.i18n.locale();
    return [
      { path: '/admin/dashboard', label: this.i18n.t('nav.overview'), icon: 'dashboard', exact: true },
      { path: '/admin/books', label: this.i18n.t('nav.books'), icon: 'book' },
      { path: '/admin/students', label: this.i18n.t('nav.students'), icon: 'school' },
      { path: '/admin/fines', label: this.i18n.t('nav.fines'), icon: 'payments' },
      { path: '/admin/sanctions', label: this.i18n.t('nav.sanctions'), icon: 'gavel' },
      { path: '/admin/loans', label: this.i18n.t('nav.loans'), icon: 'contract' },
    ];
  });

  protected readonly userProfile = computed(() => {
    this.i18n.locale();
    const user = this.authSession.user();
    const roleKey = user?.role ? `role.${user.role}` : 'role.library_staff';
    return {
      name: user
        ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
        : this.i18n.t('role.librarian'),
      role: this.i18n.t(roleKey),
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCElwiBj6bDh6i5LRIgymQJMFPgt7A_tgaGksBCK7wJ6q8nlkLD4w6KTlCUSjjRuzwFva9Tc1YTpmHom3uAQX-RaY1C5wnLQ3EWBJGscY4BOFanlSX2oHcA97NCS6Nr2a7jkiB5j8Qhg5eZ-Os859xLD9ItKHD_sTjyYU0gyBDZZNdTWH9nvOmWM_l-WAlv6RZHhGXeux4TGPjuLGFRUcrLmJ8qU5nVgHFiNfgmsKwgXMOeyPdrafpRej8PMO968UBPE4N_6q5mLBc',
      avatarAlt: 'Portrait of an admin user',
    };
  });

  protected async onLogoutRequested(): Promise<void> {
    try {
      await firstValueFrom(this.authApi.logout());
    } catch (error) {
      if (!(error instanceof AuthApiError && error.code === 'invalid_token')) {
        console.warn('Logout endpoint failed, forcing local logout.', error);
      }
    } finally {
      this.authSession.clearSession();
      await this.router.navigate(['/auth/login']);
    }
  }
}
