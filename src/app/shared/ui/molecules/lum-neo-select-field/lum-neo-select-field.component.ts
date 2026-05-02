import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumNeoFieldLabelComponent } from '../lum-neo-field-label/lum-neo-field-label.component';

export interface LumSelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-lum-neo-select-field',
  imports: [ReactiveFormsModule, LumNeoFieldLabelComponent, LumIconComponent],
  templateUrl: './lum-neo-select-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumNeoSelectFieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly options = input.required<readonly LumSelectOption[]>();
}
