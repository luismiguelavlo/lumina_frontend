import type { PublicPodiumLeader, PublicPodiumPlace, PublicRankLookupResult } from '../../../shared/models/public-ranking.models';
import type { PublicRankingTopApiItem } from '../../../shared/models/public-ranking-api.model';

/** Orden visual del podio: 2.º, 1.º, 3.º */
export const PUBLIC_RANKING_PODIUM_FALLBACK: readonly PublicPodiumLeader[] = [
  {
    place: 'second',
    name: 'Arthur Pendelton',
    pointsDisplay: '12,300 Pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnePEvRkaoeAjHsxB_lCRpAy__BROBGf8vdIsg5-0ZQtjf0oMSseJtpKL1YL0s7F__xR7LZ467FqgiMssZAkRNa6Q3VVYB3vUd6Scu9PShOMebYv9MHCpztXdPhTvvsf5LiSO_McaVoZ7r-Pm-OuTW-i8dsUkx_7U8MgplheJdAJSyFLOZfMBMMRaAlThxT0WM69L4qEiUNOu8n609SAkXMvLYvDpl88hZhybbc-WZcnhz6khEXYpIdxwJoD0wv0m_bhQ-VCzefGo',
    avatarAlt: 'Foto de perfil del 2.º lugar',
    pedestalIcon: 'emoji_events',
  },
  {
    place: 'first',
    name: 'Eleanor Vance',
    pointsDisplay: '15,420 Pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHMAzQodufV2MzUbE8uo33ZMO85Hr_-dTgPRGAvmQbGQ6HSDslGIaq7C9TPkWWgiUz-nhrylSWRyMYq60g-XAFBPyq4rLeh_O9RE7FMZxv2so1hk0Tzx8X8JRozAMwWbZqfQN20vdFPlo1yTX-7vF_VHa0oXJJ1Xu4aMrCZEZXE8yzOFvVtf73ZsqkVhlO_Dv8BsY49xHXew4OFRIFwDepNF4MoUPXVMkZizdQThSH_ein1y0jQ4XaG30Q_2XPX23l3XkYPhPjCLw',
    avatarAlt: 'Foto de perfil del 1.er lugar',
    pedestalIcon: 'military_tech',
  },
  {
    place: 'third',
    name: 'Clara Oswald',
    pointsDisplay: '10,850 Pts',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBRQFBqow99fgfU9kKtU8xfSh24rJcjKgK5e9MfeOk3LTEnGTmzSUSKKGpisC-KGGNBKmB_1yFp5_jmiDAUBtog4r1ncDjL7Arkn4WAl7ul0fTJiW8B_MUh7bW_BcfB0rM4mxtnRscdBBlrShf3mKRo4XzyWCGCgCORwWYWQp_jhsMlkSB3kUd3V945eVBu_uYLsypw-cFrXsQz4aZBMwEB-QGGFZGy5xk1IBlHW3MyFMSEhes9Rv1pS57xkkQejleaQesDuwsGRs4',
    avatarAlt: 'Foto de perfil del 3.er lugar',
    pedestalIcon: 'workspace_premium',
  },
];

export const PUBLIC_RANKING_LOOKUP_DEMO_RESULT: PublicRankLookupResult = {
  rank: 42,
  displayName: 'Tú',
  subtitle: '14 días de racha',
  pointsDisplay: '4,250',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Nc3Ztsqh85eNoEWG_Cl7eq768K5rmlTpx4yxq_MW2rQsre68UcC5gP79HlX1S_HeAFO9wlh-49UdtdJDIJNnQ4zK4qGiCIBw2bCMXDa-H_nrJIdtx2FnYTnMMVpG1yd7N4rLYHR2y0uCmKidJgbLO3Cm9hiNXPPbp_As1WSl5OrPNTPqru9pyUcsv2u9238gvRDPgz1OplhwAlIRXcRSuV2JjajW8eoDMamARb62pU1m3MIGNJsXigoTn45GJzn1_MDjxn-CxYk',
  avatarAlt: 'Tu avatar en el ranking',
};

const PLACE_BY_INDEX: readonly PublicPodiumPlace[] = ['first', 'second', 'third'];

const PODIUM_ICON: Record<PublicPodiumPlace, string> = {
  first: 'military_tech',
  second: 'emoji_events',
  third: 'workspace_premium',
};

/** Orden visual del podio en el DOM: 2.º, 1.º, 3.º */
const DISPLAY_ORDER: readonly PublicPodiumPlace[] = ['second', 'first', 'third'];

function resolveAvatarUrl(apiAvatar: string | null | undefined, fallbackUrl: string): string {
  const trimmed = typeof apiAvatar === 'string' ? apiAvatar.trim() : '';
  return trimmed || fallbackUrl;
}

/**
 * Maps API top3 into podium leaders.
 * Fills places by sorted order (handles tied ranks) and uses each student's `avatar_url`.
 */
export function mapTopRankingToPublicPodium(
  apiEntries: readonly PublicRankingTopApiItem[],
): readonly PublicPodiumLeader[] {
  if (apiEntries.length === 0) {
    return PUBLIC_RANKING_PODIUM_FALLBACK;
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

  const byPlace = new Map<PublicPodiumPlace, PublicRankingTopApiItem>();
  sorted.forEach((entry, index) => {
    const place = PLACE_BY_INDEX[index];
    if (place) {
      byPlace.set(place, entry);
    }
  });

  return DISPLAY_ORDER.map((place) => {
    const current = byPlace.get(place);
    const fallback = PUBLIC_RANKING_PODIUM_FALLBACK.find((x) => x.place === place)!;

    if (!current) {
      return fallback;
    }

    return {
      place,
      name: current.name,
      pointsDisplay: `${new Intl.NumberFormat('en-US').format(current.points)} Pts`,
      avatarUrl: resolveAvatarUrl(current.avatar_url, fallback.avatarUrl),
      avatarAlt: `Profile photo of ${current.name}`,
      pedestalIcon: PODIUM_ICON[place],
    };
  });
}
