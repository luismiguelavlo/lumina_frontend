import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-student-profile-hero',
  imports: [LumIconComponent],
  templateUrl: './lum-student-profile-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentProfileHeroComponent {
  readonly name = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly memberSinceLabel = input.required<string>();
  readonly avatarUrl = input.required<string>();
  readonly avatarAlt = input.required<string>();
  readonly verified = input(false);

  readonly editProfileClick = output<void>();

  protected onEdit(): void {
    this.editProfileClick.emit();
  }
}
