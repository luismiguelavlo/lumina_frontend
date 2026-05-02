import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lum-landing-site-footer',
  imports: [RouterLink],
  templateUrl: './lum-landing-site-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingSiteFooterComponent {}
