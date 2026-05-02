import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicCatalogBookDetail } from '../../../models/public-catalog.models';
import { LumPublicDetailStatTileComponent } from '../../atoms/lum-public-detail-stat-tile/lum-public-detail-stat-tile.component';
import { LumPublicBookDetailBadgesRowComponent } from '../../molecules/lum-public-book-detail-badges-row/lum-public-book-detail-badges-row.component';
import { LumPublicBookDetailBreadcrumbComponent } from '../../molecules/lum-public-book-detail-breadcrumb/lum-public-book-detail-breadcrumb.component';
import { LumPublicBookDetailSynopsisPanelComponent } from '../../molecules/lum-public-book-detail-synopsis-panel/lum-public-book-detail-synopsis-panel.component';

@Component({
  selector: 'app-lum-public-book-detail-layout',
  imports: [
    LumPublicBookDetailBreadcrumbComponent,
    LumPublicBookDetailBadgesRowComponent,
    LumPublicBookDetailSynopsisPanelComponent,
    LumPublicDetailStatTileComponent,
  ],
  templateUrl: './lum-public-book-detail-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicBookDetailLayoutComponent {
  readonly detail = input.required<PublicCatalogBookDetail>();
}
