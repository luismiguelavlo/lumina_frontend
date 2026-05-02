export type StudentPatronStatus = 'sanctioned' | 'active';

export interface StudentPatronRow {
  readonly patronId: string;
  /** Internal route id used for profile endpoint lookups (e.g. UUID). */
  readonly routeId?: string;
  readonly name: string;
  readonly avatarUrl: string;
  readonly avatarAlt: string;
  readonly status: StudentPatronStatus;
  readonly dateApplied: string | null;
  readonly reason: string | null;
}
