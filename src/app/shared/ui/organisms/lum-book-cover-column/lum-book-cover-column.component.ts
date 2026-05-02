import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { CatalogAvailability } from '../../../models/catalog-book.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-book-cover-column',
  imports: [LumIconComponent],
  templateUrl: './lum-book-cover-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookCoverColumnComponent {
  readonly coverUrl = input.required<string>();
  readonly coverAlt = input.required<string>();
  readonly availability = input.required<CatalogAvailability>();
  readonly totalCopies = input.required<number>();
  readonly checkedOut = input.required<number>();

  readonly changeCoverClick = output<void>();

  protected statusLabel(): string {
    return this.availability() === 'available' ? 'Available for checkout' : 'Currently borrowed';
  }
}
