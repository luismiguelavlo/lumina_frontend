import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { StatAccent } from '../../../models/dashboard.models';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-stat-summary-card',
  imports: [LumAdminGlassComponent, LumIconComponent],
  templateUrl: './lum-stat-summary-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStatSummaryCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly accent = input.required<StatAccent>();
  readonly trendDirection = input.required<'up' | 'down'>();
  readonly trendLabel = input.required<string>();
  readonly footnote = input.required<string>();

  protected accentBlobClass(accent: StatAccent): string {
    switch (accent) {
      case 'primary':
        return 'bg-primary/10';
      case 'blue':
        return 'bg-blue-500/10';
      case 'red':
        return 'bg-red-500/10';
    }
  }

  protected iconWrapClass(accent: StatAccent): string {
    switch (accent) {
      case 'primary':
        return 'bg-primary/20 text-primary';
      case 'blue':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'red':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
    }
  }
}
