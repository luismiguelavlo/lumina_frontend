import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { StudentLoanHistoryItem } from '../../../models/student-profile.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumStudentLoanTimelineItemComponent } from '../../molecules/lum-student-loan-timeline-item/lum-student-loan-timeline-item.component';

@Component({
  selector: 'app-lum-student-loan-history',
  imports: [LumIconComponent, LumStudentLoanTimelineItemComponent],
  templateUrl: './lum-student-loan-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentLoanHistoryComponent {
  readonly sectionTitle = input.required<string>();
  readonly sectionIcon = input.required<string>();
  readonly items = input.required<readonly StudentLoanHistoryItem[]>();

  readonly viewAllClick = output<void>();

  protected onViewAll(): void {
    this.viewAllClick.emit();
  }
}
