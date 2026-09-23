export interface PublicRankingTopApiItem {
  readonly rank: number;
  readonly name: string;
  readonly points: number;
  readonly student_id: string;
  readonly avatar_url?: string | null;
}

export interface PublicRankingTopApiResponse {
  readonly data: readonly PublicRankingTopApiItem[];
}

/** GET /api/ranking/students/:studentId — body shape may be flat or under `data`. */
export interface StudentRankingApiEntry {
  readonly rank?: number;
  readonly position?: number;
  readonly points?: number;
  readonly total_points?: number;
  readonly name?: string;
  readonly student_id?: string;
  readonly current_streak_days?: number;
  readonly avatar_url?: string | null;
}
