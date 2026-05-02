export interface StudentsApiItem {
  readonly id: string;
  readonly student_id_code: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly degree_level?: string;
  readonly major?: string;
  readonly expected_graduation_year?: number;
  readonly is_active: boolean;
  readonly member_since?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
}

export interface CreateStudentRequest {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly degree_level: string;
  readonly major: string;
  readonly expected_graduation_year: number;
}

export interface StudentsApiPagination {
  readonly limit: number;
  readonly offset: number;
  readonly count: number;
  readonly total: number;
  readonly current_page: number;
  readonly total_pages: number;
  readonly has_next: boolean;
  readonly has_prev: boolean;
}

export interface StudentsApiResponse {
  readonly data: readonly StudentsApiItem[];
  readonly total: number;
  readonly pagination: StudentsApiPagination;
}

export interface StudentsQuery {
  readonly limit: number;
  readonly offset: number;
  readonly search?: string;
}
