export type StatAccent = 'primary' | 'blue' | 'red';

export interface StatCardModel {
  readonly title: string;
  readonly value: string;
  readonly icon: string;
  readonly accent: StatAccent;
  readonly trendDirection: 'up' | 'down';
  readonly trendLabel: string;
  readonly footnote: string;
}

export interface BorrowedBarModel {
  readonly shortLabel: string;
  readonly fullTitle: string;
  readonly heightPct: number;
  readonly highlight?: boolean;
}

export interface ActivityItemModel {
  readonly icon: string;
  readonly tone: 'blue' | 'green' | 'red';
  readonly title: string;
  readonly subtitle: string;
  readonly time: string;
  readonly showConnector?: boolean;
}

export interface AdminNavItemModel {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
  readonly exact?: boolean;
}
