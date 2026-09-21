import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { UploadsApiService } from '../../../data-access/uploads-api.service';
import { I18nService } from '../../../i18n/i18n.service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import type { UploadFolder } from '../../../models/uploads-api.model';
import { LumNeoFieldLabelComponent } from '../lum-neo-field-label/lum-neo-field-label.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-lum-image-upload',
  imports: [ReactiveFormsModule, LumNeoFieldLabelComponent, LumIconComponent, TranslatePipe],
  templateUrl: './lum-image-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumImageUploadComponent {
  private readonly uploadsApi = inject(UploadsApiService);
  private readonly i18n = inject(I18nService);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly folder = input.required<UploadFolder>();
  readonly hint = input<string | undefined>(undefined);
  readonly disabled = input(false);
  /** Aspect ratio CSS value for the preview frame, e.g. "2 / 3" or "1 / 1". */
  readonly previewAspect = input('1 / 1');
  readonly rounded = input<'xl' | 'full'>('xl');

  readonly isUploading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  protected readonly accept = ACCEPTED;

  protected hintText(): string {
    return this.hint() ?? this.i18n.t('upload.hint');
  }

  protected previewUrl(): string {
    return this.control().value?.trim() ?? '';
  }

  protected openPicker(): void {
    if (this.disabled() || this.isUploading()) return;
    this.fileInput()?.nativeElement.click();
  }

  protected clearImage(): void {
    if (this.disabled() || this.isUploading()) return;
    this.control().setValue('');
    this.errorMessage.set(null);
    const inputEl = this.fileInput()?.nativeElement;
    if (inputEl) inputEl.value = '';
  }

  protected onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;

    if (!ACCEPTED.split(',').includes(file.type)) {
      this.errorMessage.set(this.i18n.t('upload.errors.type'));
      return;
    }
    if (file.size > MAX_BYTES) {
      this.errorMessage.set(this.i18n.t('upload.errors.size'));
      return;
    }

    this.errorMessage.set(null);
    this.isUploading.set(true);
    this.uploadsApi
      .uploadImage(file, this.folder())
      .pipe(
        take(1),
        finalize(() => this.isUploading.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.control().setValue(res.url);
          this.control().markAsDirty();
        },
        error: (err: unknown) => {
          this.errorMessage.set(
            err instanceof Error ? err.message : this.i18n.t('upload.errors.failed'),
          );
        },
      });
  }
}
