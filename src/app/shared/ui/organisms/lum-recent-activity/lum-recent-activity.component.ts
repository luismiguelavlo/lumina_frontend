import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ActivityItemModel } from '../../../models/dashboard.models';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-recent-activity',
  imports: [LumAdminGlassComponent, LumIconComponent],
  templateUrl: './lum-recent-activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumRecentActivityComponent {
  readonly sectionTitle = input.required<string>();
  readonly items = input.required<readonly ActivityItemModel[]>();
  readonly viewAllLabel = input.required<string>();

  readonly viewAllClick = output<void>();

  protected toneIconWrap(tone: ActivityItemModel['tone']): string {
    switch (tone) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'red':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    }
  }

  protected onViewAll(): void {
    this.viewAllClick.emit();
  }
}
