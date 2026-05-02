import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LumPublicBookDetailLayoutComponent } from '../../shared/ui/organisms/lum-public-book-detail-layout/lum-public-book-detail-layout.component';
import { LumPublicCatalogNavComponent } from '../../shared/ui/organisms/lum-public-catalog-nav/lum-public-catalog-nav.component';
import { LumPublicCatalogSiteFooterComponent } from '../../shared/ui/organisms/lum-public-catalog-site-footer/lum-public-catalog-site-footer.component';
import { PublicBookDetailStore } from './data-access/public-book-detail.store';

@Component({
  selector: 'app-public-book-detail-page',
  imports: [
    LumPublicCatalogNavComponent,
    LumPublicBookDetailLayoutComponent,
    LumPublicCatalogSiteFooterComponent,
  ],
  providers: [PublicBookDetailStore],
  templateUrl: './public-book-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicBookDetailPage {
  protected readonly store = inject(PublicBookDetailStore);
  protected readonly searchControl = new FormControl<string | null>('');
}
