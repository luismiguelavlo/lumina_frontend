import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { AdminNavItemModel } from '../../../models/dashboard.models';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumSidebarNavLinkComponent } from '../../molecules/lum-sidebar-nav-link/lum-sidebar-nav-link.component';

@Component({
  selector: 'app-lum-admin-sidebar',
  imports: [LumAdminGlassComponent, LumIconComponent, LumSidebarNavLinkComponent],
  templateUrl: './lum-admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumAdminSidebarComponent {
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

  protected requestLogout(): void {
    this.logoutRequested.emit();
  }
}
