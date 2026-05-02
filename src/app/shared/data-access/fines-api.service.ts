import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { CreateFineRequest, FinesApiItem, FinesApiResponse, FinesQuery } from '../models/fines-api.model';

@Injectable({ providedIn: 'root' })
export class FinesApiService {
  private readonly http = inject(HttpClient);
  private readonly finesUrl = `${environment.apiBaseUrl}/api/fines`;

  listFines(query: FinesQuery): Observable<FinesApiResponse> {
    let params = new HttpParams()
      .set('limit', String(query.limit))
      .set('offset', String(query.offset));

    if (query.student_id && query.student_id.trim()) {
      params = params.set('student_id', query.student_id.trim());
    }

    return this.http.get<FinesApiResponse>(this.finesUrl, { params });
  }

  createFine(payload: CreateFineRequest): Observable<FinesApiItem> {
    return this.http.post<FinesApiItem>(this.finesUrl, payload);
  }

  markFinePaid(fineId: string): Observable<FinesApiItem> {
    return this.http.patch<FinesApiItem>(`${this.finesUrl}/${encodeURIComponent(fineId)}/paid`, {});
  }

  markFineWaived(fineId: string): Observable<FinesApiItem> {
    return this.http.patch<FinesApiItem>(`${this.finesUrl}/${encodeURIComponent(fineId)}/waived`, {});
  }
}
