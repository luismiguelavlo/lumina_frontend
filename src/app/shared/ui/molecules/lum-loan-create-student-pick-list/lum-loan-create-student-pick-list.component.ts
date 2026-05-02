import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LoanCreateStudentOption } from '../../../models/loan-create.models';

@Component({
  selector: 'app-lum-loan-create-student-pick-list',
  imports: [],
  templateUrl: './lum-loan-create-student-pick-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateStudentPickListComponent {
  readonly options = input.required<readonly LoanCreateStudentOption[]>();

  readonly pick = output<LoanCreateStudentOption>();
}
