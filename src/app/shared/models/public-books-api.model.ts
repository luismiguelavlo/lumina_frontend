export type PublicBookStatus = 'available' | 'checked_out' | 'borrowed' | string;

export interface PublicBooksApiItem {
  readonly id: string;
  readonly cover_url?: string;
  readonly title: string;
  readonly author: string;
  readonly isbn?: string;
  readonly status: PublicBookStatus;
  readonly genre_id?: string;
  readonly genre_name?: string;
}

export interface PublicBookDetailAuthor {
  readonly id: string;
  readonly name: string;
}

export interface PublicBookDetailGenre {
  readonly id: string;
  readonly name: string;
  readonly code?: string;
}

export interface PublicBookDetailApiResponse {
  readonly id: string;
  readonly title: string;
  readonly isbn?: string;
  readonly catalog_code?: string;
  readonly synopsis?: string;
  readonly publication_year?: number;
  readonly pages?: number;
  readonly cover_url?: string;
  readonly location?: string;
  readonly total_copies?: number;
  readonly status?: PublicBookStatus;
  readonly authors?: readonly PublicBookDetailAuthor[];
  readonly genres?: readonly PublicBookDetailGenre[];
  readonly created_at?: string;
  readonly updated_at?: string;
}

/** PATCH body: author and genre are not sent (not updatable via this endpoint). */
export interface PublicBookPatchBody {
  readonly title: string;
  readonly isbn?: string;
  readonly catalog_code?: string;
  readonly synopsis?: string;
  readonly publication_year: number;
  readonly pages: number;
  readonly cover_url?: string;
  readonly location?: string;
  readonly total_copies: number;
  readonly status: PublicBookStatus;
}

export interface PublicBooksPagination {
  readonly limit: number;
  readonly offset: number;
  readonly count: number;
  readonly total: number;
  readonly current_page: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
}

export interface PublicBooksApiResponse {
  readonly data: readonly PublicBooksApiItem[];
  readonly total: number;
  readonly pagination: PublicBooksPagination;
}

export interface PublicBooksQuery {
  readonly limit: number;
  readonly offset: number;
  readonly search?: string;
  readonly genreId?: string;
}

/** POST /api/books — create catalog entry. */
export interface CreateBookRequest {
  readonly title: string;
  readonly isbn: string;
  readonly catalog_code: string;
  readonly synopsis?: string;
  readonly publication_year: number;
  readonly pages: number;
  readonly cover_url?: string;
  readonly location?: string;
  readonly total_copies: number;
  readonly author_ids: readonly string[];
  readonly genre_ids: readonly string[];
}
