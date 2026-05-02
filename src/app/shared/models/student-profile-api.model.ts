export interface StudentProfileStatsApi {
  readonly total_read: number;
  readonly active_loans: number;
  readonly overdue_count: number;
  readonly current_streak_days: number;
}

export interface StudentProfileBadgeApi {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description?: string;
  readonly criteria?: string;
  readonly earned: boolean;
}

export interface StudentProfileBadgeGalleryApi {
  readonly total_badges: number;
  readonly earned_count: number;
  readonly badges: readonly StudentProfileBadgeApi[];
}

export interface StudentProfileLoanHistoryApiItem {
  readonly id?: string;
  readonly title?: string;
  readonly authors?: string;
  readonly status?: string;
  readonly borrowed_at?: string;
  readonly due_at?: string;
  readonly returned_at?: string;
}

export interface StudentProfileApiResponse {
  readonly id: string;
  readonly student_id_code: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly degree_level?: string;
  readonly major?: string;
  readonly member_since?: string;
  readonly email: string;
  readonly expected_graduation_year?: number;
  readonly personal_stats: StudentProfileStatsApi;
  readonly loan_history: readonly StudentProfileLoanHistoryApiItem[];
  readonly badge_gallery: StudentProfileBadgeGalleryApi;
}
