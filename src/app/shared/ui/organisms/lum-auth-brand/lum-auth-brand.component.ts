import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-auth-brand',
  imports: [LumIconComponent],
  templateUrl: './lum-auth-brand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumAuthBrandComponent {
  readonly iconName = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
