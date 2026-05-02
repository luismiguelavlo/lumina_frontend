import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-field-label',
  imports: [],
  templateUrl: './lum-field-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFieldLabelComponent {
  readonly forId = input.required<string>();
  readonly text = input.required<string>();
  readonly extraClass = input<string>('');
}
