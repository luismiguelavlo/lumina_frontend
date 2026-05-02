import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-sidebar-nav-link',
  imports: [RouterLink, RouterLinkActive, LumIconComponent],
  templateUrl: './lum-sidebar-nav-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumSidebarNavLinkComponent {
  readonly routePath = input.required<string>();
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly exact = input(false);
}
