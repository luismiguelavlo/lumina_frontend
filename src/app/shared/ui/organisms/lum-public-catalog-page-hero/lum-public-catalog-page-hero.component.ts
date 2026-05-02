import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-public-catalog-page-hero',
  imports: [],
  templateUrl: './lum-public-catalog-page-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogPageHeroComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
