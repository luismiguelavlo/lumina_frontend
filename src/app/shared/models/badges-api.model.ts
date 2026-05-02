export interface BadgeCatalogItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly criteria?: string;
  readonly created_at?: string;
}

export interface BadgesListApiResponse {
  readonly data: readonly BadgeCatalogItem[];
}

export interface AwardStudentBadgeRequest {
  readonly badge_id: string;
}
