import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-loan-create-due-field',
  imports: [ReactiveFormsModule, LumIconComponent],
  templateUrl: './lum-loan-create-due-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCreateDueFieldComponent {
  readonly label = input<string>('Due date');
  readonly hint = input<string>('Standard loan period: 14 days.');
  readonly control = input.required<FormControl<string>>();
}
