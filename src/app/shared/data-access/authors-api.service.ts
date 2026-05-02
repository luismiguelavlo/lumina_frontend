import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AuthorApiItem, AuthorListItem, CreateAuthorRequest } from '../models/authors-api.model';

@Injectable({ providedIn: 'root' })
export class AuthorsApiService {
  private readonly http = inject(HttpClient);
  private readonly authorsUrl = `${environment.apiBaseUrl}/api/authors`;

  listAuthors(): Observable<readonly AuthorListItem[]> {
    return this.http.get<unknown>(this.authorsUrl).pipe(map((response) => this.normalizeAuthors(response)));
  }

  createAuthor(payload: CreateAuthorRequest): Observable<AuthorApiItem> {
    return this.http.post<AuthorApiItem>(this.authorsUrl, payload);
  }

  private normalizeAuthors(response: unknown): readonly AuthorListItem[] {
    const rows = this.extractRows(response);
    return rows
      .map((row: unknown, index: number) => this.toAuthor(row, index))
      .filter((row: AuthorListItem | null): row is AuthorListItem => row !== null);
  }

  private extractRows(response: unknown): readonly unknown[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === 'object' && 'data' in response) {
      const data = (response as { data?: unknown }).data;
      if (Array.isArray(data)) {
        return data;
      }
    }
    return [];
  }

  private toAuthor(row: unknown, index: number): AuthorListItem | null {
    if (!row || typeof row !== 'object') {
      return null;
    }
    const candidate = row as Record<string, unknown>;
    const nameRaw = candidate['name'] ?? candidate['full_name'];
    const idRaw = candidate['id'] ?? candidate['author_id'];

    if (typeof nameRaw !== 'string' || !nameRaw.trim()) {
      return null;
    }

    const name = nameRaw.trim();
    const fallbackId = `author-${index}`;
    const id =
      typeof idRaw === 'string' && idRaw.trim()
        ? idRaw.trim()
        : typeof idRaw === 'number'
          ? String(idRaw)
          : fallbackId;

    return { id, name };
  }
}
