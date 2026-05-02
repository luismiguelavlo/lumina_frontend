import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ProfileStatTileData } from '../../../models/student-profile.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumProfileStatTileComponent } from '../../molecules/lum-profile-stat-tile/lum-profile-stat-tile.component';

@Component({
  selector: 'app-lum-student-profile-stats-section',
  imports: [LumIconComponent, LumProfileStatTileComponent],
  templateUrl: './lum-student-profile-stats-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentProfileStatsSectionComponent {
  readonly sectionTitle = input.required<string>();
  readonly sectionIcon = input.required<string>();
  readonly stats = input.required<readonly ProfileStatTileData[]>();
}
