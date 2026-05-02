import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { StudentPatronRow } from '../../../models/student-patron.model';
import { LumStudentStatusChipComponent } from '../../molecules/lum-student-status-chip/lum-student-status-chip.component';
import { LumTableStudentIdentityCellComponent } from '../../molecules/lum-table-student-identity-cell/lum-table-student-identity-cell.component';

@Component({
  selector: 'app-lum-students-table',
  imports: [LumStudentStatusChipComponent, LumTableStudentIdentityCellComponent],
  templateUrl: './lum-students-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentsTableComponent {
  readonly rows = input.required<readonly StudentPatronRow[]>();

  readonly viewProfileClick = output<StudentPatronRow>();

  protected onViewProfile(row: StudentPatronRow): void {
    this.viewProfileClick.emit(row);
  }

  protected initialsFromName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0][0] ?? '';
    const last = parts[parts.length - 1][0] ?? '';
    return (first + last).toUpperCase();
  }
}
