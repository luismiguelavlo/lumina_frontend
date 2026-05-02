import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicRankLookupResult } from '../../../models/public-ranking.models';

@Component({
  selector: 'app-lum-public-ranking-result-row',
  imports: [],
  templateUrl: './lum-public-ranking-result-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicRankingResultRowComponent {
  readonly result = input<PublicRankLookupResult | null>(null);
}
