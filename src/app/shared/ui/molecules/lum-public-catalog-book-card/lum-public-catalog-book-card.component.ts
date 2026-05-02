import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PublicCatalogBook } from '../../../models/public-catalog.models';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-catalog-book-card',
  imports: [LumIconComponent, RouterLink],
  templateUrl: './lum-public-catalog-book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogBookCardComponent {
  readonly book = input.required<PublicCatalogBook>();

  protected readonly categoryClasses = computed(
    () =>
      `mb-1 text-[0.75rem] font-bold tracking-wider uppercase ${this.book().categoryTextClass}`,
  );
}
