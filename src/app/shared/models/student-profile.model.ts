export type ProfileStatAccent = 'primary' | 'neutral' | 'danger';

export interface ProfileStatTileData {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly accent: ProfileStatAccent;
  readonly valueSuffix?: string;
}

export interface ProfileBadgeTileData {
  readonly icon: string;
  readonly label: string;
  readonly locked: boolean;
  /** Badge definition id (admin grant/revoke). */
  readonly id?: string;
  readonly slug?: string;
  readonly description?: string;
  readonly criteria?: string;
}

export type StudentLoanTimelineTone = 'active' | 'returned';

export interface StudentLoanHistoryItem {
  readonly coverUrl: string;
  readonly coverAlt: string;
  readonly title: string;
  readonly authors: string;
  readonly statusLabel: string;
  readonly tone: StudentLoanTimelineTone;
  readonly primaryDateLabel: string;
  readonly dueDateLabel?: string;
  readonly dateRangeLabel?: string;
  readonly ratingOutOf5?: number;
  readonly segmentLabel?: string;
  readonly timelineDotActive: boolean;
}

export interface StudentProfileDetail {
  readonly patronId: string;
  readonly name: string;
  readonly subtitle: string;
  readonly memberSinceLabel: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
  readonly verified: boolean;
  readonly stats: readonly ProfileStatTileData[];
  readonly badges: readonly ProfileBadgeTileData[];
  readonly badgeUnlocked: number;
  readonly badgeTotal: number;
  readonly loans: readonly StudentLoanHistoryItem[];
}
