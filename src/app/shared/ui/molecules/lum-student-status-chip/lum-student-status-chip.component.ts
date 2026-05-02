import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { StudentPatronStatus } from '../../../models/student-patron.model';

@Component({
  selector: 'app-lum-student-status-chip',
  imports: [],
  templateUrl: './lum-student-status-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentStatusChipComponent {
  readonly status = input.required<StudentPatronStatus>();
}
