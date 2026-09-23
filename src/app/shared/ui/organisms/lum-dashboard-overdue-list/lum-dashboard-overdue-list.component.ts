import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { OverdueLoanRowModel } from '../../../models/dashboard.models';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-dashboard-overdue-list',
  imports: [LumAdminGlassComponent, LumIconComponent],
  templateUrl: './lum-dashboard-overdue-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumDashboardOverdueListComponent {
  readonly sectionTitle = input.required<string>();
  readonly emptyLabel = input.required<string>();
  readonly viewAllLabel = input.required<string>();
  readonly items = input.required<readonly OverdueLoanRowModel[]>();

  readonly viewAllClick = output<void>();

  protected onViewAll(): void {
    this.viewAllClick.emit();
  }
}
