import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-dashboard-page-header',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-dashboard-page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumDashboardPageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly showNotificationDot = input(true);

  readonly notificationsClick = output<void>();

  protected onNotificationsClick(): void {
    this.notificationsClick.emit();
  }
}
