import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { StudentLoanHistoryItem } from '../../../models/student-profile.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-student-loan-timeline-item',
  imports: [LumIconComponent],
  templateUrl: './lum-student-loan-timeline-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentLoanTimelineItemComponent {
  readonly item = input.required<StudentLoanHistoryItem>();
  readonly isLast = input(false);

  protected readonly starSlots = [1, 2, 3, 4, 5] as const;
}
