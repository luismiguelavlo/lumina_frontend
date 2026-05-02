export interface LoanCreateStudentOption {
  readonly id: string;
  readonly studentId?: string;
  readonly name: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
  readonly statusLabel: string;
}

export interface LoanCreateBookOption {
  readonly id: string;
  readonly bookId?: string;
  readonly title: string;
  readonly author: string;
  readonly isbn: string;
  readonly coverUrl: string;
  readonly coverAlt: string;
}
