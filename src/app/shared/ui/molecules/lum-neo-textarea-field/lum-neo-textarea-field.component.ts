import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LumNeoFieldLabelComponent } from '../lum-neo-field-label/lum-neo-field-label.component';

@Component({
  selector: 'app-lum-neo-textarea-field',
  imports: [ReactiveFormsModule, LumNeoFieldLabelComponent],
  templateUrl: './lum-neo-textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumNeoTextareaFieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly rows = input(4);
}
