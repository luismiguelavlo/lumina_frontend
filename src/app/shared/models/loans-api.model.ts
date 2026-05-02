export interface CreateLoanRequest {
  readonly student_id: string;
  readonly book_id: string;
  readonly due_date: string;
}

export interface CreateLoanSuccessResponse {
  readonly loan_id: string;
  readonly book_id: string;
  readonly book_title: string;
  readonly borrower: string;
  readonly borrowed_at: string;
  readonly due_date: string;
  readonly time_remaining: number;
  readonly isbn: string;
  readonly status: string;
}

export interface CreateLoanBusinessMessageResponse {
  readonly message: string;
}

export interface LoansApiItem {
  readonly loan_id: string;
  readonly book_id?: string;
  readonly book_title?: string;
  readonly borrower?: string;
  readonly borrower_name?: string;
  readonly borrowed_at?: string;
  readonly due_date?: string;
  readonly time_remaining?: number;
  readonly isbn?: string;
  readonly status?: string;
}

export interface LoansApiPagination {
  readonly limit: number;
  readonly offset: number;
  readonly count: number;
  readonly total: number;
  readonly current_page: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
}

export interface LoansApiResponse {
  readonly data: readonly LoansApiItem[];
  readonly total: number;
  readonly pagination: LoansApiPagination;
}

export interface LoansQuery {
  readonly limit: number;
  readonly offset: number;
  readonly student_id?: string;
}
