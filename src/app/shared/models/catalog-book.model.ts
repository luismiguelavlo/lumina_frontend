export type CatalogAvailability = 'available' | 'borrowed';

export interface CatalogBook {
  /** Route param for `/admin/books/:id` */
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly sku: string;
  readonly coverUrl: string;
  readonly coverAlt: string;
  readonly availability: CatalogAvailability;
}
