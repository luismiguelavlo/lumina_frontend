export interface AnalyticsDashboardMostBorrowedBookApi {
  readonly book_id: string;
  readonly title: string;
  readonly catalog_code: string;
  readonly borrow_count: number;
  readonly author_names?: readonly string[];
}

export interface AnalyticsDashboardActivityApi {
  readonly id: string;
  readonly event_type: string;
  readonly title: string;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
  readonly created_at: string;
  readonly actor_name?: string;
  readonly student_name?: string;
}

export interface AnalyticsDashboardApiResponse {
  readonly total_books: number;
  readonly active_students: number;
  readonly overdue_fines: number;
  readonly most_borrowed_books: readonly AnalyticsDashboardMostBorrowedBookApi[];
  readonly recent_activity: readonly AnalyticsDashboardActivityApi[];
}
