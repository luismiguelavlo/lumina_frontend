export type LandingLeaderRank = 1 | 2 | 3;

export interface LandingLeaderCard {
  readonly rank: LandingLeaderRank;
  readonly name: string;
  readonly pointsDisplay: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
  readonly badgeIcons: readonly string[];
  readonly championSubtitle?: string;
}
