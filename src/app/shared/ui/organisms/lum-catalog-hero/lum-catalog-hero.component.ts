import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumCatalogSearchComponent } from '../../molecules/lum-catalog-search/lum-catalog-search.component';

@Component({
  selector: 'app-lum-catalog-hero',
  imports: [LumCatalogSearchComponent],
  templateUrl: './lum-catalog-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCatalogHeroComponent {
  readonly title = input.required<string>();
  readonly tagline = input.required<string>();
  readonly searchPlaceholder = input.required<string>();
  readonly searchQuery = input<string>('');

  readonly queryChange = output<string>();
}
