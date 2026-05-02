import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lum-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './lum-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCheckboxComponent {
  readonly control = input.required<FormControl<boolean>>();
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
}
