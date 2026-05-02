import type { CatalogAvailability } from './catalog-book.model';

export interface BookDetailSnapshot {
  readonly libraryId: string;
  readonly coverUrl: string;
  readonly coverAlt: string;
  readonly availability: CatalogAvailability;
  readonly totalCopies: number;
  readonly checkedOut: number;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly publicationYear: number;
  readonly pages: number;
  readonly synopsis: string;
  readonly genre: string;
  readonly locationShelf: string;
}
