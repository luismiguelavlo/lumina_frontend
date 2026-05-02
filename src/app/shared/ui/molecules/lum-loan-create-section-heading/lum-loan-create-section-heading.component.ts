import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-loan-create-section-heading',
  imports: [],
  templateUrl: './lum-loan-create-section-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateSectionHeadingComponent {
  readonly step = input.required<string>();
  readonly title = input.required<string>();
}
