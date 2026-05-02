import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LumIconComponent } from '../lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-detail-stat-tile',
  imports: [LumIconComponent],
  templateUrl: './lum-public-detail-stat-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicDetailStatTileComponent {
  readonly iconName = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
}
