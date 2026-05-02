import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LumPublicCatalogBookGridComponent } from '../../shared/ui/organisms/lum-public-catalog-book-grid/lum-public-catalog-book-grid.component';
import { LumPublicCatalogFiltersBarComponent } from '../../shared/ui/organisms/lum-public-catalog-filters-bar/lum-public-catalog-filters-bar.component';
import { LumPublicCatalogNavComponent } from '../../shared/ui/organisms/lum-public-catalog-nav/lum-public-catalog-nav.component';
import { LumPublicCatalogPageHeroComponent } from '../../shared/ui/organisms/lum-public-catalog-page-hero/lum-public-catalog-page-hero.component';
import { LumPublicCatalogSiteFooterComponent } from '../../shared/ui/organisms/lum-public-catalog-site-footer/lum-public-catalog-site-footer.component';
import { PublicCatalogStore } from './data-access/public-catalog.store';

@Component({
  selector: 'app-public-catalog-page',
  imports: [
    LumPublicCatalogNavComponent,
    LumPublicCatalogPageHeroComponent,
    LumPublicCatalogFiltersBarComponent,
    LumPublicCatalogBookGridComponent,
    LumPublicCatalogSiteFooterComponent,
  ],
  providers: [PublicCatalogStore],
  templateUrl: './public-catalog.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCatalogPage {
  protected readonly store = inject(PublicCatalogStore);
}
