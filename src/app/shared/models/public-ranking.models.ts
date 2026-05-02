export type PublicPodiumPlace = 'first' | 'second' | 'third';

export interface PublicPodiumLeader {
  readonly place: PublicPodiumPlace;
  readonly name: string;
  readonly pointsDisplay: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
  readonly pedestalIcon: string;
}

export interface PublicRankLookupResult {
  /** 0 = unknown / not ranked in response */
  readonly rank: number;
  readonly displayName: string;
  readonly subtitle: string;
  readonly pointsDisplay: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
}

export interface PublicRankStudentSuggestion {
  readonly id: string;
  readonly label: string;
  readonly subtitle: string;
}
