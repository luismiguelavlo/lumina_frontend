import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AnalyticsDashboardApiResponse } from '../models/analytics-dashboard-api.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);
  private readonly analyticsUrl = `${environment.apiBaseUrl}/api/analytics`;

  getDashboard(): Observable<AnalyticsDashboardApiResponse> {
    return this.http.get<AnalyticsDashboardApiResponse>(`${this.analyticsUrl}/dashboard`);
  }
}
