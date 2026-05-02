import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LumLandingSiteHeaderComponent } from '../../shared/ui/organisms/lum-landing-site-header/lum-landing-site-header.component';
import { LumPublicRankLookupCardComponent } from '../../shared/ui/molecules/lum-public-rank-lookup-card/lum-public-rank-lookup-card.component';
import { LumPublicRankingIntroComponent } from '../../shared/ui/organisms/lum-public-ranking-intro/lum-public-ranking-intro.component';
import { LumPublicRankingPodiumComponent } from '../../shared/ui/organisms/lum-public-ranking-podium/lum-public-ranking-podium.component';
import { LumPublicRankingResultRowComponent } from '../../shared/ui/molecules/lum-public-ranking-result-row/lum-public-ranking-result-row.component';
import { PublicRankingStore } from './data-access/public-ranking.store';

@Component({
  selector: 'app-public-rankings-page',
  imports: [
    LumLandingSiteHeaderComponent,
    LumPublicRankingIntroComponent,
    LumPublicRankingPodiumComponent,
    LumPublicRankLookupCardComponent,
    LumPublicRankingResultRowComponent,
  ],
  providers: [PublicRankingStore],
  templateUrl: './public-rankings.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicRankingsPage {
  protected readonly store = inject(PublicRankingStore);
}
