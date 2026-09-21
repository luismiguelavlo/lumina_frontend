import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import type { AdminNavItemModel } from '../../../models/dashboard.models';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { ThemeService } from '../../../theme/theme.service';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumSidebarNavLinkComponent } from '../../molecules/lum-sidebar-nav-link/lum-sidebar-nav-link.component';

@Component({
  selector: 'app-lum-admin-sidebar',
  imports: [
    LumAdminGlassComponent,
    LumIconComponent,
    LumSidebarNavLinkComponent,
    TranslatePipe,
  ],
  templateUrl: './lum-admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumAdminSidebarComponent {
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);

  /** When false on viewports below `md`, the sidebar is not shown (drawer closed). */
  readonly mobileOpen = input(false);

  readonly brandTitle = input.required<string>();
  readonly brandIcon = input.required<string>();

  readonly navItems = input.required<readonly AdminNavItemModel[]>();

  readonly userName = input.required<string>();
  readonly userRole = input.required<string>();
  readonly avatarUrl = input.required<string>();
  readonly avatarAlt = input.required<string>();

  readonly logoutRequested = output<void>();

  protected readonly locale = this.i18n.locale;
  protected readonly isDark = this.theme.isDark;

  protected readonly languageButtonLabel = computed(() =>
    this.i18n.locale() === 'en' ? this.i18n.t('nav.switchToEs') : this.i18n.t('nav.switchToEn'),
  );
  protected readonly languageButtonShort = computed(() =>
    this.i18n.locale() === 'en' ? 'ES' : 'EN',
  );

  protected readonly themeButtonLabel = computed(() =>
    this.theme.isDark() ? this.i18n.t('nav.switchToLight') : this.i18n.t('nav.switchToDark'),
  );
  protected readonly themeModeLabel = computed(() =>
    this.theme.isDark() ? this.i18n.t('nav.theme.dark') : this.i18n.t('nav.theme.light'),
  );
  protected readonly themeIcon = computed(() => (this.theme.isDark() ? 'dark_mode' : 'light_mode'));

  protected requestLogout(): void {
    this.logoutRequested.emit();
  }

  protected toggleLanguage(): void {
    this.i18n.toggleLocale();
  }

  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }
}
