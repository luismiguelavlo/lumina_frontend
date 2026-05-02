import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { StudentProfileApiResponse } from '../models/student-profile-api.model';

@Injectable({ providedIn: 'root' })
export class StudentProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly studentsBaseUrl = `${environment.apiBaseUrl}/api/students`;

  getProfile(studentId: string, loanLimit = 10): Observable<StudentProfileApiResponse> {
    const encodedId = encodeURIComponent(studentId.trim());
    return this.http.get<StudentProfileApiResponse>(
      `${this.studentsBaseUrl}/${encodedId}/profile?loan_limit=${loanLimit}`,
    );
  }
}
