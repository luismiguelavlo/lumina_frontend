import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-catalog-nav',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, LumIconComponent],
  templateUrl: './lum-public-catalog-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogNavComponent {
  readonly brandLabel = input.required<string>();
  readonly searchPlaceholder = input.required<string>();
  readonly searchControl = input.required<FormControl<string | null>>();
}
