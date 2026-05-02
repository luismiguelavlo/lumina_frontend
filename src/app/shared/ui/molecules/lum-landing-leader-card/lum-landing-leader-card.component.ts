import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { LandingLeaderCard } from '../../../models/landing.models';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-landing-leader-card',
  imports: [LumIconComponent],
  templateUrl: './lum-landing-leader-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingLeaderCardComponent {
  readonly leader = input.required<LandingLeaderCard>();

  protected iconClass(rank: number): string {
    return rank === 1 ? 'text-primary' : 'text-primary/60';
  }
}
