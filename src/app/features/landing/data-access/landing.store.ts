import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { PublicRankingApiService } from '../../../shared/data-access/public-ranking-api.service';
import { LANDING_TOP_LEADERS_FALLBACK, mapTopRankingToLandingLeaders } from '../data/landing-leaders.data';

@Injectable()
export class LandingStore {
  private readonly rankingApi = inject(PublicRankingApiService);

  private readonly top3Entries = toSignal(
    this.rankingApi.getTop3().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  readonly leaders = computed(() => {
    const entries = this.top3Entries();
    return entries.length === 0 ? LANDING_TOP_LEADERS_FALLBACK : mapTopRankingToLandingLeaders(entries);
  });
}
