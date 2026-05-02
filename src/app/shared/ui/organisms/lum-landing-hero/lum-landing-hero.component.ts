import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-landing-hero',
  imports: [RouterLink, LumIconComponent],
  templateUrl: './lum-landing-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingHeroComponent {}
