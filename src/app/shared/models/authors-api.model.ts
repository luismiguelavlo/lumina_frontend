export interface CreateAuthorRequest {
  readonly name: string;
  readonly bio?: string;
}

/** Response shape may vary; we only rely on fields we need for UI feedback. */
export interface AuthorApiItem {
  readonly id?: string;
  readonly name?: string;
  readonly bio?: string | null;
}

/** Normalized row from GET /api/authors for pick lists. */
export interface AuthorListItem {
  readonly id: string;
  readonly name: string;
}
