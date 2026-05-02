import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LumLandingExploreSectionComponent } from '../../shared/ui/organisms/lum-landing-explore-section/lum-landing-explore-section.component';
import { LumLandingHeroComponent } from '../../shared/ui/organisms/lum-landing-hero/lum-landing-hero.component';
import { LumLandingSiteFooterComponent } from '../../shared/ui/organisms/lum-landing-site-footer/lum-landing-site-footer.component';
import { LumLandingSiteHeaderComponent } from '../../shared/ui/organisms/lum-landing-site-header/lum-landing-site-header.component';
import { LumLandingTopThreeSectionComponent } from '../../shared/ui/organisms/lum-landing-top-three-section/lum-landing-top-three-section.component';
import { LandingStore } from './data-access/landing.store';

@Component({
  selector: 'app-landing-page',
  imports: [
    LumLandingSiteHeaderComponent,
    LumLandingHeroComponent,
    LumLandingTopThreeSectionComponent,
    LumLandingExploreSectionComponent,
    LumLandingSiteFooterComponent,
  ],
  providers: [LandingStore],
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  protected readonly store = inject(LandingStore);
}
