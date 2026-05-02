import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-public-ranking-intro',
  imports: [],
  templateUrl: './lum-public-ranking-intro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicRankingIntroComponent {
  readonly heading = input.required<string>();
  readonly subheading = input.required<string>();
}
