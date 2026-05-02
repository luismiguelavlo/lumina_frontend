export interface SanctionRow {
  readonly id: string;
  readonly studentName: string;
  readonly recordId: string;
  readonly initials: string;
  readonly reason: string;
  readonly appliedOnLabel: string;
  readonly appliedByLabel: string;
}
