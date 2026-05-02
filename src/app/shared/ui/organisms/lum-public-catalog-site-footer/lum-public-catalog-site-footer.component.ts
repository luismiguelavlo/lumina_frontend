import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface LumPublicCatalogFooterLink {
  readonly label: string;
  readonly href: string;
}

@Component({
  selector: 'app-lum-public-catalog-site-footer',
  imports: [],
  templateUrl: './lum-public-catalog-site-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogSiteFooterComponent {
  readonly brandLabel = input.required<string>();
  readonly links = input.required<readonly LumPublicCatalogFooterLink[]>();
  readonly copyright = input.required<string>();
}
