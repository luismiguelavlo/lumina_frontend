import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CatalogAvailability } from '../../../models/catalog-book.model';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-lum-book-availability-badge',
  imports: [TranslatePipe],
  templateUrl: './lum-book-availability-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookAvailabilityBadgeComponent {
  readonly availability = input.required<CatalogAvailability>();
}
