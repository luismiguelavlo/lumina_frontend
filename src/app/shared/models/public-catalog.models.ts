export type PublicCatalogAvailability = 'available' | 'checked_out';

export type PublicCatalogFilterId = string;

export type PublicCatalogSortId = 'relevance' | 'title' | 'date';

/** Full public detail view (no shelf location in UI). */
export interface PublicCatalogBookDetail {
  readonly bookId: string;
  readonly breadcrumbCategory: string;
  readonly title: string;
  readonly author: string;
  readonly coverUrl: string;
  readonly coverAlt: string;
  readonly availability: PublicCatalogAvailability;
  readonly secondaryBadgeLabel: string;
  readonly synopsis: string;
  readonly publishedYear: string;
  readonly pageCount: string;
}

export interface PublicCatalogBook {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly genreId?: string;
  readonly categoryLabel: string;
  /** Tailwind classes for category label, e.g. `text-primary` */
  readonly categoryTextClass: string;
  readonly coverUrl: string;
  readonly coverAlt: string;
  readonly availability: PublicCatalogAvailability;
  readonly showBookmark?: boolean;
  readonly isNewArrival?: boolean;
  readonly isClassic?: boolean;
  /** For “Date added” sort (newer first when descending). */
  readonly addedAt: number;
  /** Card border utilities; default applied in component if omitted. */
  readonly cardBorderClass?: string;
}
