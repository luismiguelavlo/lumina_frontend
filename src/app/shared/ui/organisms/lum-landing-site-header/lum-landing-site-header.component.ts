import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-lum-landing-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './lum-landing-site-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingSiteHeaderComponent {}
