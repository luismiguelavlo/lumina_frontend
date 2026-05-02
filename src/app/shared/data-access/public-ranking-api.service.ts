import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  PublicRankingTopApiItem,
  PublicRankingTopApiResponse,
  StudentRankingApiEntry,
} from '../models/public-ranking-api.model';
import type { PublicRankLookupResult } from '../models/public-ranking.models';

const RANKING_LOOKUP_AVATAR =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80';

@Injectable({ providedIn: 'root' })
export class PublicRankingApiService {
  private readonly http = inject(HttpClient);
  private readonly top3Url = `${environment.apiBaseUrl}/api/ranking/top3`;

  getTop3(): Observable<readonly PublicRankingTopApiItem[]> {
    return this.http.get<PublicRankingTopApiResponse>(this.top3Url).pipe(
      map((response) =>
        (response.data ?? [])
          .filter((entry) => Number.isFinite(entry.rank) && entry.rank >= 1 && entry.rank <= 3)
          .sort((a, b) => a.rank - b.rank),
      ),
    );
  }

  getStudentRanking(studentId: string): Observable<PublicRankLookupResult> {
    const url = `${environment.apiBaseUrl}/api/ranking/students/${encodeURIComponent(studentId)}`;
    return this.http.get<unknown>(url).pipe(map((body) => this.mapStudentRankingBody(body)));
  }

  private mapStudentRankingBody(body: unknown): PublicRankLookupResult {
    const entry = this.unwrapStudentRankingEntry(body);
    const rankRaw: unknown = entry.rank ?? entry.position;
    let rank = 0;
    if (typeof rankRaw === 'number' && Number.isFinite(rankRaw)) {
      rank = rankRaw;
    } else if (typeof rankRaw === 'string' && rankRaw.trim()) {
      const parsed = Number.parseInt(rankRaw, 10);
      rank = Number.isFinite(parsed) ? parsed : 0;
    }
    const pointsRaw = entry.points ?? entry.total_points ?? 0;
    const points =
      typeof pointsRaw === 'number' && Number.isFinite(pointsRaw)
        ? pointsRaw
        : typeof pointsRaw === 'string'
          ? Number.parseFloat(pointsRaw)
          : 0;
    const name =
      typeof entry.name === 'string' && entry.name.trim() ? entry.name.trim() : 'Estudiante';
    const streak = entry.current_streak_days;
    const subtitle =
      typeof streak === 'number' && streak > 0
        ? `${streak} días de racha`
        : 'Posición en el ranking general';

    return {
      rank: Number.isFinite(rank) && rank > 0 ? rank : 0,
      displayName: name,
      subtitle,
      pointsDisplay: new Intl.NumberFormat('es-ES').format(Number.isFinite(points) ? points : 0),
      avatarUrl: RANKING_LOOKUP_AVATAR,
      avatarAlt: `Avatar de ${name}`,
    };
  }

  private unwrapStudentRankingEntry(body: unknown): StudentRankingApiEntry {
    if (!body || typeof body !== 'object') {
      return {};
    }
    const root = body as Record<string, unknown>;
    const data = root['data'];
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as StudentRankingApiEntry;
    }
    return body as StudentRankingApiEntry;
  }
}
