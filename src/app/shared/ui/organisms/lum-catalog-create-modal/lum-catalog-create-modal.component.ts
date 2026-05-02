import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumNeoInputFieldComponent } from '../../molecules/lum-neo-input-field/lum-neo-input-field.component';
import { LumNeoTextareaFieldComponent } from '../../molecules/lum-neo-textarea-field/lum-neo-textarea-field.component';
import {
  LumNeoMultiSearchPickComponent,
  type LumMultiSearchPickOption,
} from '../../molecules/lum-neo-multi-search-pick/lum-neo-multi-search-pick.component';
import type { LumCatalogCreateTab } from './lum-catalog-create-tab';

@Component({
  selector: 'app-lum-catalog-create-modal',
  imports: [
    ReactiveFormsModule,
    LumIconComponent,
    LumNeoInputFieldComponent,
    LumNeoTextareaFieldComponent,
    LumNeoMultiSearchPickComponent,
  ],
  templateUrl: './lum-catalog-create-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCatalogCreateModalComponent {
  readonly activeTab = input.required<LumCatalogCreateTab>();
  readonly isModalBusy = input(false);

  readonly authorForm = input.required<FormGroup>();
  readonly isSavingAuthor = input(false);
  readonly authorErrorMessage = input<string | null>(null);

  readonly bookForm = input.required<FormGroup>();
  readonly isSavingBook = input(false);
  readonly bookErrorMessage = input<string | null>(null);
  readonly authorPickOptions = input.required<readonly LumMultiSearchPickOption[]>();
  readonly genrePickOptions = input.required<readonly LumMultiSearchPickOption[]>();
  readonly isLoadingPicklists = input(false);

  readonly tabChange = output<LumCatalogCreateTab>();
  readonly cancelClick = output<void>();
  readonly submitAuthorClick = output<void>();
  readonly submitBookClick = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isModalBusy()) {
      this.cancelClick.emit();
    }
  }

  protected selectTab(tab: LumCatalogCreateTab): void {
    if (this.isModalBusy()) return;
    this.tabChange.emit(tab);
  }
}
