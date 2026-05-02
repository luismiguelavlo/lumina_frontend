import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicCatalogAvailability } from '../../../models/public-catalog.models';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-book-detail-badges-row',
  imports: [LumIconComponent],
  templateUrl: './lum-public-book-detail-badges-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicBookDetailBadgesRowComponent {
  readonly availability = input.required<PublicCatalogAvailability>();
  readonly secondaryBadgeLabel = input.required<string>();
}
