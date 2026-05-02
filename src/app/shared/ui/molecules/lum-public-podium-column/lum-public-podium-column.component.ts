import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicPodiumLeader } from '../../../models/public-ranking.models';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-podium-column',
  imports: [LumIconComponent],
  templateUrl: './lum-public-podium-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicPodiumColumnComponent {
  readonly leader = input.required<PublicPodiumLeader>();
}
