import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type {
  PublicCatalogFilterId,
  PublicCatalogSortId,
} from '../../../models/public-catalog.models';
import { LumFilterPillButtonComponent } from '../../atoms/lum-filter-pill-button/lum-filter-pill-button.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

export interface LumPublicCatalogFilterOption {
  readonly id: PublicCatalogFilterId;
  readonly label: string;
}

export interface LumPublicCatalogSortOption {
  readonly id: PublicCatalogSortId;
  readonly label: string;
}

@Component({
  selector: 'app-lum-public-catalog-filters-bar',
  imports: [LumFilterPillButtonComponent, LumIconComponent],
  templateUrl: './lum-public-catalog-filters-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicCatalogFiltersBarComponent {
  readonly filterOptions = input.required<readonly LumPublicCatalogFilterOption[]>();
  readonly selectedFilterId = input.required<PublicCatalogFilterId>();
  readonly sortOptions = input.required<readonly LumPublicCatalogSortOption[]>();
  readonly selectedSortId = input.required<PublicCatalogSortId>();

  readonly filterChange = output<PublicCatalogFilterId>();
  readonly sortChange = output<PublicCatalogSortId>();

  protected pickFilter(id: PublicCatalogFilterId): void {
    this.filterChange.emit(id);
  }

  protected onSortSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as PublicCatalogSortId;
    this.sortChange.emit(value);
  }
}
