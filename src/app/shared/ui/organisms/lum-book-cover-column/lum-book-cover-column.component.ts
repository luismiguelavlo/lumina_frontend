import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { CatalogAvailability } from '../../../models/catalog-book.model';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-book-cover-column',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-book-cover-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookCoverColumnComponent {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private readonly i18n = inject(I18nService);

  readonly coverUrl = input.required<string>();
  readonly coverAlt = input.required<string>();
  readonly availability = input.required<CatalogAvailability>();
  readonly totalCopies = input.required<number>();
  readonly checkedOut = input.required<number>();
  readonly isUploadingCover = input(false);

  readonly coverFileSelected = output<File>();

  readonly localError = signal<string | null>(null);

  protected statusLabel(): string {
    this.i18n.locale();
    return this.availability() === 'available'
      ? this.i18n.t('bookDetail.status.available')
      : this.i18n.t('bookDetail.status.borrowed');
  }

  protected openPicker(): void {
    if (this.isUploadingCover()) return;
    this.localError.set(null);
    this.fileInput()?.nativeElement.click();
  }

  protected onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      this.localError.set(this.i18n.t('bookDetail.cover.errors.type'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.localError.set(this.i18n.t('bookDetail.cover.errors.size'));
      return;
    }
    this.coverFileSelected.emit(file);
  }
}
