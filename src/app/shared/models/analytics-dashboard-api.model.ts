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

export interface AnalyticsDashboardTopOverdueApi {
  readonly loan_id: string;
  readonly student_id: string;
  readonly student_name: string;
  readonly student_code?: string;
  readonly book_id: string;
  readonly book_title: string;
  readonly due_date: string;
  readonly days_overdue: number;
}

export interface AnalyticsDashboardApiResponse {
  readonly total_books: number;
  readonly active_students: number;
  /** Pending fines amount (legacy field name from API). */
  readonly overdue_fines: number;
  readonly pending_fines_count: number;
  readonly overdue_loans: number;
  readonly active_loans: number;
  readonly due_soon: number;
  readonly active_sanctions: number;
  readonly returns_this_week: number;
  readonly new_students_month: number;
  readonly available_copies: number;
  readonly checked_out_copies: number;
  readonly most_borrowed_books: readonly AnalyticsDashboardMostBorrowedBookApi[];
  readonly recent_activity: readonly AnalyticsDashboardActivityApi[];
  readonly top_overdue: readonly AnalyticsDashboardTopOverdueApi[];
}
