import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-text-link',
  imports: [],
  templateUrl: './lum-text-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumTextLinkComponent {
  readonly href = input.required<string>();
  readonly label = input.required<string>();
  readonly variant = input<'primary' | 'muted'>('primary');
  readonly size = input<'xs' | 'sm'>('sm');
  readonly emphasis = input(false);
}
