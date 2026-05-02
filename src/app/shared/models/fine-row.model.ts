export type FineStatusFilter = 'pending' | 'paid' | 'waived';

export interface FineRow {
  readonly id: string;
  readonly studentName: string;
  readonly studentIdDisplay: string;
  readonly initials: string;
  readonly amountLabel: string;
  readonly status: FineStatusFilter;
  readonly reason: string;
  readonly reasonTitle: string;
}
