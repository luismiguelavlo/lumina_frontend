import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import type { LumSelectOption } from '../../molecules/lum-neo-select-field/lum-neo-select-field.component';
import { LumNeoInputFieldComponent } from '../../molecules/lum-neo-input-field/lum-neo-input-field.component';
import { LumNeoSelectFieldComponent } from '../../molecules/lum-neo-select-field/lum-neo-select-field.component';
import { LumNeoTextareaFieldComponent } from '../../molecules/lum-neo-textarea-field/lum-neo-textarea-field.component';

@Component({
  selector: 'app-lum-book-editor-form',
  imports: [
    ReactiveFormsModule,
    LumNeoInputFieldComponent,
    LumNeoTextareaFieldComponent,
    LumNeoSelectFieldComponent,
    TranslatePipe,
  ],
  templateUrl: './lum-book-editor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookEditorFormComponent {
  readonly form = input.required<FormGroup>();
  readonly genreOptions = input.required<readonly LumSelectOption[]>();
}
