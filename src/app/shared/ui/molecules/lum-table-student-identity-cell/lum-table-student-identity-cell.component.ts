import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared student column for admin tables (sanctions, fines, students):
 * initials disc + name + monospace detail line (matches sanctions styling).
 */
@Component({
  selector: 'app-lum-table-student-identity-cell',
  imports: [],
  templateUrl: './lum-table-student-identity-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumTableStudentIdentityCellComponent {
  readonly name = input.required<string>();
  readonly initials = input.required<string>();
  /** When set, shows the student photo instead of initials. */
  readonly avatarUrl = input<string | undefined>(undefined);
  readonly avatarAlt = input<string | undefined>(undefined);
  /** Optional second line (e.g. record ID). Rendered in monospace when set. */
  readonly detailLine = input<string | undefined>(undefined);
}
