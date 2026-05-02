import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateSanctionRequest,
  SanctionApiItem,
  SanctionsApiResponse,
  SanctionsQuery,
} from '../models/sanctions-api.model';

@Injectable({ providedIn: 'root' })
export class SanctionsApiService {
  private readonly http = inject(HttpClient);
  private readonly sanctionsUrl = `${environment.apiBaseUrl}/api/sanctions`;

  createSanction(payload: CreateSanctionRequest): Observable<SanctionApiItem> {
    return this.http.post<SanctionApiItem>(this.sanctionsUrl, payload);
  }

  listSanctions(query: SanctionsQuery): Observable<SanctionsApiResponse> {
    let params = new HttpParams()
      .set('limit', String(query.limit))
      .set('offset', String(query.offset));
    if (query.student_id?.trim()) {
      params = params.set('student_id', query.student_id.trim());
    }
    return this.http.get<SanctionsApiResponse>(this.sanctionsUrl, { params });
  }

  liftSanction(sanctionId: string): Observable<SanctionApiItem> {
    return this.http.patch<SanctionApiItem>(
      `${this.sanctionsUrl}/${encodeURIComponent(sanctionId)}`,
      {},
    );
  }
}
