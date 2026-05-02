import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateStudentRequest,
  StudentsApiItem,
  StudentsApiResponse,
  StudentsQuery,
} from '../models/students-api.model';

@Injectable({ providedIn: 'root' })
export class StudentsApiService {
  private readonly http = inject(HttpClient);
  private readonly studentsUrl = `${environment.apiBaseUrl}/api/students`;

  listStudents(query: StudentsQuery): Observable<StudentsApiResponse> {
    let params = new HttpParams()
      .set('limit', String(query.limit))
      .set('offset', String(query.offset));

    const search = query.search?.trim();
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<StudentsApiResponse>(this.studentsUrl, { params });
  }

  createStudent(payload: CreateStudentRequest): Observable<StudentsApiItem> {
    return this.http.post<StudentsApiItem>(this.studentsUrl, payload);
  }

  updateStudent(studentId: string, payload: CreateStudentRequest): Observable<StudentsApiItem> {
    return this.http.patch<StudentsApiItem>(`${this.studentsUrl}/${encodeURIComponent(studentId)}`, payload);
  }

  deleteStudent(studentId: string): Observable<void> {
    return this.http.delete<void>(`${this.studentsUrl}/${encodeURIComponent(studentId)}`);
  }

  awardBadge(studentId: string, badgeId: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.studentsUrl}/${encodeURIComponent(studentId)}/badges`, {
      badge_id: badgeId,
    });
  }

  removeStudentBadge(studentId: string, badgeId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.studentsUrl}/${encodeURIComponent(studentId)}/badges/${encodeURIComponent(badgeId)}`,
    );
  }
}
