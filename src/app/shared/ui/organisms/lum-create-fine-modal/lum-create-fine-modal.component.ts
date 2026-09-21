import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumNeoInputFieldComponent } from '../../molecules/lum-neo-input-field/lum-neo-input-field.component';
import {
  LumNeoSelectFieldComponent,
  type LumSelectOption,
} from '../../molecules/lum-neo-select-field/lum-neo-select-field.component';
import { LumNeoTextareaFieldComponent } from '../../molecules/lum-neo-textarea-field/lum-neo-textarea-field.component';

@Component({
  selector: 'app-lum-create-fine-modal',
  imports: [
    ReactiveFormsModule,
    LumIconComponent,
    LumNeoSelectFieldComponent,
    LumNeoInputFieldComponent,
    LumNeoTextareaFieldComponent,
    TranslatePipe,
  ],
  templateUrl: './lum-create-fine-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCreateFineModalComponent {
  readonly form = input.required<FormGroup>();
  readonly loanOptions = input.required<readonly LumSelectOption[]>();
  readonly isLoadingLoans = input(false);
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
