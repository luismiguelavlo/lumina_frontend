export interface FinesApiItem {
  readonly id: string;
  readonly loan_id: string;
  readonly student_id: string;
  readonly amount: number;
  readonly status: 'pending' | 'paid' | 'waived' | string;
  readonly reason?: string;
  readonly created_at?: string;
  readonly paid_at?: string | null;
  readonly student_name?: string;
}

export interface FinesApiPagination {
  readonly limit: number;
  readonly offset: number;
  readonly count: number;
  readonly total: number;
  readonly current_page: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
}

export interface FinesApiResponse {
  readonly data: readonly FinesApiItem[];
  readonly total: number;
  readonly pagination: FinesApiPagination;
}

export interface FinesQuery {
  readonly limit: number;
  readonly offset: number;
  readonly student_id?: string;
}

export interface CreateFineRequest {
  readonly loan_id: string;
  readonly student_id: string;
  readonly amount: number;
  readonly reason: string;
}
