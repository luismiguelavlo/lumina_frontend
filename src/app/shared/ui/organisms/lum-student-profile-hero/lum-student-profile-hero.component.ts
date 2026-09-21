import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
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
  /** True while the profile API is still loading. */
  readonly isLoading = input(false);

  readonly editProfileClick = output<void>();

  /** True until the avatar image finishes decoding (avoids Unsplash→real flash). */
  readonly isAvatarPending = signal(true);

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      const url = this.avatarUrl();
      if (loading || !url.trim()) {
        this.isAvatarPending.set(true);
        return;
      }
      this.isAvatarPending.set(true);
      const img = new Image();
      img.onload = () => this.isAvatarPending.set(false);
      img.onerror = () => this.isAvatarPending.set(false);
      img.src = url;
    });
  }

  protected showAvatarImage(): boolean {
    return !this.isLoading() && !this.isAvatarPending() && Boolean(this.avatarUrl().trim());
  }

  protected onEdit(): void {
    this.editProfileClick.emit();
  }
}
