import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LumNeoFieldLabelComponent } from '../lum-neo-field-label/lum-neo-field-label.component';

@Component({
  selector: 'app-lum-neo-input-field',
  imports: [ReactiveFormsModule, LumNeoFieldLabelComponent],
  templateUrl: './lum-neo-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumNeoInputFieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly inputType = input<'text' | 'number'>('text');
  readonly mono = input(false);
  readonly autocomplete = input<string | null>(null);
}
