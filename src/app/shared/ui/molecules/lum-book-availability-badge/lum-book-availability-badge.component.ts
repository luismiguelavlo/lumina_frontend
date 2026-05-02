import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CatalogAvailability } from '../../../models/catalog-book.model';

@Component({
  selector: 'app-lum-book-availability-badge',
  imports: [],
  templateUrl: './lum-book-availability-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookAvailabilityBadgeComponent {
  readonly availability = input.required<CatalogAvailability>();
}
