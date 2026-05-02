import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateLoanBusinessMessageResponse,
  CreateLoanRequest,
  CreateLoanSuccessResponse,
  LoansApiResponse,
  LoansQuery,
} from '../models/loans-api.model';

@Injectable({ providedIn: 'root' })
export class LoansApiService {
  private readonly http = inject(HttpClient);
  private readonly loansUrl = `${environment.apiBaseUrl}/api/loans`;

  createLoan(
    payload: CreateLoanRequest,
  ): Observable<HttpResponse<CreateLoanSuccessResponse | CreateLoanBusinessMessageResponse>> {
    return this.http.post<CreateLoanSuccessResponse | CreateLoanBusinessMessageResponse>(
      this.loansUrl,
      payload,
      { observe: 'response' },
    );
  }

  listLoans(query: LoansQuery): Observable<LoansApiResponse> {
    let params = new HttpParams()
      .set('limit', String(query.limit))
      .set('offset', String(query.offset));

    if (query.student_id && query.student_id.trim()) {
      params = params.set('student_id', query.student_id.trim());
    }

    return this.http.get<LoansApiResponse>(this.loansUrl, { params });
  }

  returnLoan(loanId: string): Observable<unknown> {
    return this.http.patch(`${this.loansUrl}/${encodeURIComponent(loanId)}/return`, {});
  }
}
