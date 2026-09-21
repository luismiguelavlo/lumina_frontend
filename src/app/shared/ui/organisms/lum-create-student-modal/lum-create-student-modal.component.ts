import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumNeoInputFieldComponent } from '../../molecules/lum-neo-input-field/lum-neo-input-field.component';
import {
  LumNeoSelectFieldComponent,
  type LumSelectOption,
} from '../../molecules/lum-neo-select-field/lum-neo-select-field.component';
import { LumImageUploadComponent } from '../../molecules/lum-image-upload/lum-image-upload.component';

@Component({
  selector: 'app-lum-create-student-modal',
  imports: [
    ReactiveFormsModule,
    LumIconComponent,
    LumNeoInputFieldComponent,
    LumNeoSelectFieldComponent,
    LumImageUploadComponent,
    TranslatePipe,
  ],
  templateUrl: './lum-create-student-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCreateStudentModalComponent {
  readonly form = input.required<FormGroup>();
  readonly degreeOptions = input.required<readonly LumSelectOption[]>();
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly submitLabel = input<string | undefined>(undefined);
  readonly isSaving = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly cancelClick = output<void>();
  readonly submitClick = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isSaving()) {
      this.cancelClick.emit();
    }
  }
}
