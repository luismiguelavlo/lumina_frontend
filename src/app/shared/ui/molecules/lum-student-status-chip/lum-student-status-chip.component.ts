import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { StudentPatronStatus } from '../../../models/student-patron.model';
import { TranslatePipe } from '../../../i18n/translate.pipe';

@Component({
  selector: 'app-lum-student-status-chip',
  imports: [TranslatePipe],
  templateUrl: './lum-student-status-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentStatusChipComponent {
  readonly status = input.required<StudentPatronStatus>();
}
