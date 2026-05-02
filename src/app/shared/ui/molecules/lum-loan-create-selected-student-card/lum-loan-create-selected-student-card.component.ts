import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LoanCreateStudentOption } from '../../../models/loan-create.models';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-loan-create-selected-student-card',
  imports: [LumIconComponent],
  templateUrl: './lum-loan-create-selected-student-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateSelectedStudentCardComponent {
  readonly student = input.required<LoanCreateStudentOption>();

  readonly clearClick = output<void>();

  protected clear(): void {
    this.clearClick.emit();
  }
}
