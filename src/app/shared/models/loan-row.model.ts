export type LoanTimeUrgency = 'critical' | 'warning' | 'safe' | 'very_safe';

export interface LoanRow {
  readonly id: string;
  readonly bookTitle: string;
  readonly loanIdLabel: string;
  readonly borrowerName: string;
  readonly borrowerInitials: string;
  readonly dueIsToday: boolean;
  /** Shown when `dueIsToday` is false (e.g. "Oct 28, 2023"). */
  readonly dueDateLabel: string;
  readonly daysLeftLabel: string;
  readonly progressPercent: number;
  readonly urgency: LoanTimeUrgency;
}
