import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { PublicGenre, PublicGenresApiPayload } from '../models/public-genre.model';

@Injectable({ providedIn: 'root' })
export class PublicGenresApiService {
  private readonly http = inject(HttpClient);
  private readonly genresUrl = `${environment.apiBaseUrl}/api/genres`;

  getGenres(): Observable<readonly PublicGenre[]> {
    return this.http.get<PublicGenresApiPayload>(this.genresUrl).pipe(
      map((response) => this.normalizeResponse(response)),
    );
  }

  private normalizeResponse(response: PublicGenresApiPayload): readonly PublicGenre[] {
    const rows = this.extractRows(response);

    return rows
      .map((row: unknown, index: number) => this.toGenre(row, index))
      .filter((row: PublicGenre | null): row is PublicGenre => row !== null);
  }

  private extractRows(response: PublicGenresApiPayload): readonly unknown[] {
    if (Array.isArray(response)) {
      return response;
    }
    const wrapped = response as { data?: readonly unknown[] };
    return Array.isArray(wrapped.data) ? wrapped.data : [];
  }

  private toGenre(row: unknown, index: number): PublicGenre | null {
    if (typeof row === 'string' && row.trim()) {
      const name = row.trim();
      return { id: this.slugify(name), name };
    }

    if (!row || typeof row !== 'object') {
      return null;
    }

    const candidate = row as Record<string, unknown>;
    const nameRaw = candidate['name'] ?? candidate['genre'] ?? candidate['label'];
    const idRaw = candidate['id'] ?? candidate['genre_id'] ?? candidate['slug'];

    if (typeof nameRaw !== 'string' || !nameRaw.trim()) {
      return null;
    }

    const name = nameRaw.trim();
    const fallbackId = `genre-${index}-${this.slugify(name)}`;
    const id =
      typeof idRaw === 'string' && idRaw.trim()
        ? idRaw.trim()
        : typeof idRaw === 'number'
          ? String(idRaw)
          : fallbackId;

    return { id, name };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
