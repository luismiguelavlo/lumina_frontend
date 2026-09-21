import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { CatalogAvailability } from '../../../models/catalog-book.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-book-cover-column',
  imports: [LumIconComponent],
  templateUrl: './lum-book-cover-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookCoverColumnComponent {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly coverUrl = input.required<string>();
  readonly coverAlt = input.required<string>();
  readonly availability = input.required<CatalogAvailability>();
  readonly totalCopies = input.required<number>();
  readonly checkedOut = input.required<number>();
  readonly isUploadingCover = input(false);

  readonly coverFileSelected = output<File>();

  readonly localError = signal<string | null>(null);

  protected statusLabel(): string {
    return this.availability() === 'available' ? 'Available for checkout' : 'Currently borrowed';
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
      this.localError.set('Usa JPEG, PNG, WebP o GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.localError.set('Máximo 5 MB.');
      return;
    }
    this.coverFileSelected.emit(file);
  }
}
