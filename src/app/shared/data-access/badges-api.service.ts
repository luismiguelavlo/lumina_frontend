import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { BadgeCatalogItem, BadgesListApiResponse } from '../models/badges-api.model';

@Injectable({ providedIn: 'root' })
export class BadgesApiService {
  private readonly http = inject(HttpClient);
  private readonly badgesUrl = `${environment.apiBaseUrl}/api/badges`;

  listBadges(): Observable<readonly BadgeCatalogItem[]> {
    return this.http.get<unknown>(this.badgesUrl).pipe(
      map((res) => {
        const data =
          res &&
          typeof res === 'object' &&
          'data' in res &&
          Array.isArray((res as BadgesListApiResponse).data)
            ? (res as BadgesListApiResponse).data
            : [];
        return data
          .map((row: unknown) => this.normalizeBadge(row))
          .filter((b): b is BadgeCatalogItem => b !== null);
      }),
    );
  }

  private normalizeBadge(row: unknown): BadgeCatalogItem | null {
    if (!row || typeof row !== 'object') {
      return null;
    }
    const o = row as Record<string, unknown>;
    const id = typeof o['id'] === 'string' && o['id'].trim() ? o['id'].trim() : null;
    const slug = typeof o['slug'] === 'string' && o['slug'].trim() ? o['slug'].trim() : null;
    const name = typeof o['name'] === 'string' && o['name'].trim() ? o['name'].trim() : null;
    if (!id || !slug || !name) {
      return null;
    }
    return {
      id,
      slug,
      name,
      description: typeof o['description'] === 'string' ? o['description'] : undefined,
      criteria: typeof o['criteria'] === 'string' ? o['criteria'] : undefined,
      created_at: typeof o['created_at'] === 'string' ? o['created_at'] : undefined,
    };
  }
}
