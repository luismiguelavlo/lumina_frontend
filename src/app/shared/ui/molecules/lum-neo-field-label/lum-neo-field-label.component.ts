import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-neo-field-label',
  imports: [],
  templateUrl: './lum-neo-field-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumNeoFieldLabelComponent {
  readonly text = input.required<string>();
}
