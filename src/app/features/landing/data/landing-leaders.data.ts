import type { LandingLeaderCard, LandingLeaderRank } from '../../../shared/models/landing.models';
import type { PublicRankingTopApiItem } from '../../../shared/models/public-ranking-api.model';

/** Display order: 2nd, 1st, 3rd (podium layout). */
export const LANDING_TOP_LEADERS_FALLBACK: readonly LandingLeaderCard[] = [
  {
    rank: 2,
    name: 'Sarah J.',
    pointsDisplay: '2,450 pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPPgVRjnhY0htThUmMZg1Na4k5ApkKVFxY8SogowWEZJV6cDxABbsknxt2TnVR0dXA8VqNsqvvksIuRv7ZGnDHYijk9-QrwMYd855pWU1g4UXX6dzcKaPPU5QwZsOpfYqB6KveYrdxmFVTx4sHjwHCAim2CsRwDiGMf5_p47wSDroISyNyDGNBn9aw5ZDBDmhIrxE91QO_R3y6YN4_JD4t9vb-kOjcR-EtARPmfJc7_OyrAy4Drzl1s29lY-_bNSHkNjMcfrEeBs0',
    avatarAlt: 'Portrait of Sarah J.',
    badgeIcons: ['workspace_premium', 'local_fire_department'],
  },
  {
    rank: 1,
    name: 'Marcus T.',
    pointsDisplay: '3,120 pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAlGud86zjrMt6XZlWEQ-3JskRodyqBpdNsp6yof2J-6_Z3Lg6Npv-wcmYwF0gu1HC6PatdX6OCuIM_egclpfDGCpTgDSmHx_nYR5z_VdZBRaHOEO-CjucVolmE25vqJQzKqgJn7q_DpI7g--uSIVksCqPqT0Yrn38wcjyIUsbSbWkHeBOTnvukahEHQ1Thit-xxXaopd9BjFqMYxBeVhoQoVnoT8pEiq0dX__qB93UoRBgwpnvN5gE3VosNNy0v53LD9LQ1BEg6FM',
    avatarAlt: 'Portrait of Marcus T.',
    badgeIcons: ['workspace_premium', 'local_fire_department', 'menu_book'],
    championSubtitle: 'Reigning champion',
  },
  {
    rank: 3,
    name: 'Elena R.',
    pointsDisplay: '2,100 pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgGdhE11Yc_hqIbiNJ0jTV7d0qRuFQfslQqFZHJZ-GpBc4_QWErl0SQK3kvcUomDrw9kBOLVPQzs1Af_CLcHarB92iaG8vlA6AuT18vpChS3WwuMMF9GKXmw4vwuxINV3fv_9300hwXcdxCy7i3H70GDMx-WMVcl3do8WLvazJBMh7HBNoWkcgSh7LsXrDMGpx9b535lzViGPNXEK9hUJaHTsTQinCMwhLLGo817celr-KbuG1-vCpLe8fOrLX3ZLsNTNrZbu7kd4',
    avatarAlt: 'Portrait of Elena R.',
    badgeIcons: ['workspace_premium'],
  },
];

const BADGES_BY_RANK: Record<LandingLeaderRank, readonly string[]> = {
  1: ['workspace_premium', 'local_fire_department', 'menu_book'],
  2: ['workspace_premium', 'local_fire_department'],
  3: ['workspace_premium'],
};

/** Visual podium slots in DOM order: 2nd, 1st, 3rd. */
const DISPLAY_ORDER: readonly LandingLeaderRank[] = [2, 1, 3];

function resolveAvatarUrl(apiAvatar: string | null | undefined, fallbackUrl: string): string {
  const trimmed = typeof apiAvatar === 'string' ? apiAvatar.trim() : '';
  return trimmed || fallbackUrl;
}

/**
 * Maps API top3 rows into podium cards.
 * Uses sorted order (not unique rank numbers) so ties (e.g. two rank=2) still fill places 1–3,
 * and prefers each student's `avatar_url` from the API.
 */
export function mapTopRankingToLandingLeaders(
  apiEntries: readonly PublicRankingTopApiItem[],
): readonly LandingLeaderCard[] {
  if (apiEntries.length === 0) {
    return LANDING_TOP_LEADERS_FALLBACK;
  }

  const sorted = [...apiEntries]
    .filter((entry) => Number.isFinite(entry.rank) && entry.rank >= 1)
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        b.points - a.points ||
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    )
    .slice(0, 3);

  const byPlace = new Map<LandingLeaderRank, PublicRankingTopApiItem>();
  sorted.forEach((entry, index) => {
    byPlace.set((index + 1) as LandingLeaderRank, entry);
  });

  return DISPLAY_ORDER.map((place) => {
    const current = byPlace.get(place);
    const fallback = LANDING_TOP_LEADERS_FALLBACK.find((x) => x.rank === place)!;

    if (!current) {
      return fallback;
    }

    return {
      rank: place,
      name: current.name,
      pointsDisplay: `${new Intl.NumberFormat('en-US').format(current.points)} pts`,
      avatarUrl: resolveAvatarUrl(current.avatar_url, fallback.avatarUrl),
      avatarAlt: `Portrait of ${current.name}`,
      badgeIcons: BADGES_BY_RANK[place],
      championSubtitle: place === 1 ? 'Reigning champion' : undefined,
    };
  });
}
