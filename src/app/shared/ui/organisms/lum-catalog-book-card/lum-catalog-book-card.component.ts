import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CatalogBook } from '../../../models/catalog-book.model';
import { LumBookAvailabilityBadgeComponent } from '../../molecules/lum-book-availability-badge/lum-book-availability-badge.component';

@Component({
  selector: 'app-lum-catalog-book-card',
  imports: [RouterLink, LumBookAvailabilityBadgeComponent],
  templateUrl: './lum-catalog-book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCatalogBookCardComponent {
  readonly book = input.required<CatalogBook>();
}
