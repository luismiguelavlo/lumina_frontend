import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ProfileBadgeTileData } from '../../../models/student-profile.model';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumProfileBadgeTileComponent } from '../../molecules/lum-profile-badge-tile/lum-profile-badge-tile.component';

@Component({
  selector: 'app-lum-student-badge-gallery',
  imports: [LumIconComponent, LumProfileBadgeTileComponent, TranslatePipe],
  templateUrl: './lum-student-badge-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentBadgeGalleryComponent {
  readonly sectionTitle = input.required<string>();
  readonly sectionIcon = input.required<string>();
  readonly countLabel = input.required<string>();
  readonly badges = input.required<readonly ProfileBadgeTileData[]>();
  readonly adminMode = input(false);
  readonly mutatingBadgeId = input<string | null>(null);

  readonly grantBadge = output<string>();
  readonly revokeBadge = output<string>();

  protected trackBadge(_index: number, b: ProfileBadgeTileData): string {
    return b.id ?? b.label;
  }

  protected onTileClick(b: ProfileBadgeTileData): void {
    const id = b.id;
    if (!id) {
      return;
    }
    if (b.locked) {
      this.grantBadge.emit(id);
    } else {
      this.revokeBadge.emit(id);
    }
  }

  protected isBusy(b: ProfileBadgeTileData): boolean {
    const id = b.id;
    return id != null && this.mutatingBadgeId() === id;
  }
}
