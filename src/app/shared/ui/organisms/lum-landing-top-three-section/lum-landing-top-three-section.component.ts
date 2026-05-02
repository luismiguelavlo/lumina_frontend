import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { LandingLeaderCard } from '../../../models/landing.models';
import { LumLandingLeaderCardComponent } from '../../molecules/lum-landing-leader-card/lum-landing-leader-card.component';

@Component({
  selector: 'app-lum-landing-top-three-section',
  imports: [RouterLink, LumLandingLeaderCardComponent],
  templateUrl: './lum-landing-top-three-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingTopThreeSectionComponent {
  readonly leaders = input.required<readonly LandingLeaderCard[]>();
}
