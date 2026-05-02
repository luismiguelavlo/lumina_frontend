import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicPodiumLeader } from '../../../models/public-ranking.models';
import { LumPublicPodiumColumnComponent } from '../../molecules/lum-public-podium-column/lum-public-podium-column.component';

@Component({
  selector: 'app-lum-public-ranking-podium',
  imports: [LumPublicPodiumColumnComponent],
  templateUrl: './lum-public-ranking-podium.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicRankingPodiumComponent {
  readonly leaders = input.required<readonly PublicPodiumLeader[]>();
}
