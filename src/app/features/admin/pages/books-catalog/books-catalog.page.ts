import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LumCatalogBookCardComponent } from '../../../../shared/ui/organisms/lum-catalog-book-card/lum-catalog-book-card.component';
import { LumCatalogFabComponent } from '../../../../shared/ui/atoms/lum-catalog-fab/lum-catalog-fab.component';
import { LumCatalogHeroComponent } from '../../../../shared/ui/organisms/lum-catalog-hero/lum-catalog-hero.component';
import { LumFilterPillButtonComponent } from '../../../../shared/ui/atoms/lum-filter-pill-button/lum-filter-pill-button.component';
import { LumCatalogCreateModalComponent } from '../../../../shared/ui/organisms/lum-catalog-create-modal/lum-catalog-create-modal.component';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { AdminBooksCatalogStore } from './books-catalog.store';

@Component({
  selector: 'app-books-catalog-page',
  imports: [
    LumCatalogHeroComponent,
    LumCatalogBookCardComponent,
    LumCatalogFabComponent,
    LumFilterPillButtonComponent,
    LumCatalogCreateModalComponent,
    TranslatePipe,
  ],
  providers: [AdminBooksCatalogStore],
  templateUrl: './books-catalog.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksCatalogPage {
  protected readonly store = inject(AdminBooksCatalogStore);

  protected onAddToCatalog(): void {
    this.store.openCreateModal();
  }
}
