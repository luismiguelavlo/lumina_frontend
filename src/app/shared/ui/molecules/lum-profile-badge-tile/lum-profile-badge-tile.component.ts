import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-profile-badge-tile',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-profile-badge-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumProfileBadgeTileComponent {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly locked = input(false);
  readonly adminMode = input(false);
  readonly busy = input(false);
  readonly description = input<string | undefined>(undefined);
  readonly criteria = input<string | undefined>(undefined);

  readonly tileClick = output<void>();

  protected tooltip(): string {
    const parts = [this.description(), this.criteria()].filter((s): s is string => Boolean(s?.trim()));
    return parts.join('\n\n') || this.label();
  }

  protected onActivate(event: Event): void {
    if (!this.adminMode() || this.busy()) {
      return;
    }
    if (event instanceof KeyboardEvent && event.key === ' ') {
      event.preventDefault();
    }
    this.tileClick.emit();
  }
}
