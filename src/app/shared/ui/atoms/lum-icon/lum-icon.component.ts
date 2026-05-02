import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-icon',
  imports: [],
  templateUrl: './lum-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumIconComponent {
  readonly name = input.required<string>();
  readonly extraClass = input<string>('');
}
