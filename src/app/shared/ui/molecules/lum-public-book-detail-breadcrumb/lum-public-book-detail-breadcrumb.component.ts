import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-book-detail-breadcrumb',
  imports: [RouterLink, LumIconComponent],
  templateUrl: './lum-public-book-detail-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicBookDetailBreadcrumbComponent {
  readonly backLabel = input<string>('Back to Catalog');
  readonly categoryLabel = input.required<string>();
  readonly catalogLink = input<readonly string[]>(['/catalog']);
}
