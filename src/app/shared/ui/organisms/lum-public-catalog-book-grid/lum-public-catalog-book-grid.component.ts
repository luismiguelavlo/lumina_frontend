import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PublicCatalogBook } from '../../../models/public-catalog.models';
import { LumPublicCatalogBookCardComponent } from '../../molecules/lum-public-catalog-book-card/lum-public-catalog-book-card.component';

@Component({
  selector: 'app-lum-public-catalog-book-grid',
  imports: [LumPublicCatalogBookCardComponent],
  templateUrl: './lum-public-catalog-book-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogBookGridComponent {
  readonly books = input.required<readonly PublicCatalogBook[]>();
}
