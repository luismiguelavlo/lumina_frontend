import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-landing-explore-section',
  imports: [LumIconComponent, RouterLink],
  templateUrl: './lum-landing-explore-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLandingExploreSectionComponent {}
