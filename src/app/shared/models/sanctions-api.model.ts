export interface CreateSanctionRequest {
  readonly student_id: string;
  readonly reason: string;
}

export interface SanctionApiItem {
  readonly sanction_id: string;
  readonly student_id: string;
  readonly student_id_code?: string;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly email?: string;
  readonly reason: string;
  readonly applied_at?: string;
  readonly applied_by_id?: string;
  readonly updated_at?: string;
}

export interface SanctionsApiPagination {
  readonly limit: number;
  readonly offset: number;
  readonly count: number;
  readonly total: number;
  readonly current_page: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
}

export interface SanctionsApiResponse {
  readonly data: readonly SanctionApiItem[];
  readonly total: number;
  readonly pagination: SanctionsApiPagination;
}

export interface SanctionsQuery {
  readonly limit: number;
  readonly offset: number;
  readonly student_id?: string;
}
