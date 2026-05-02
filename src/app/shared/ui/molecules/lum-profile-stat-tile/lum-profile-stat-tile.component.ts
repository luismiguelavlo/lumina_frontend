import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ProfileStatAccent } from '../../../models/student-profile.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-profile-stat-tile',
  imports: [LumIconComponent],
  templateUrl: './lum-profile-stat-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumProfileStatTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly accent = input<ProfileStatAccent>('primary');
  readonly valueSuffix = input<string>();

  protected blobClass(accent: ProfileStatAccent): string {
    switch (accent) {
      case 'danger':
        return 'text-red-500/10 group-hover:text-red-500/20';
      case 'neutral':
        return 'text-primary/10 group-hover:text-primary/20';
      default:
        return 'text-primary/10 group-hover:text-primary/20';
    }
  }

  protected valueClass(accent: ProfileStatAccent): string {
    switch (accent) {
      case 'danger':
        return 'text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100';
      default:
        return 'text-3xl font-bold tracking-tight text-primary';
    }
  }
}
