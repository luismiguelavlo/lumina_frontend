import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LumIconComponent } from '../lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-button',
  imports: [LumIconComponent],
  templateUrl: './lum-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly label = input.required<string>();
  readonly endIcon = input<string | null>(null);
  readonly disabled = input(false);
  readonly variant = input<'primary'>('primary');
}
