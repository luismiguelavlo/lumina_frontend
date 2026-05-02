import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumNeoTextareaFieldComponent } from '../../molecules/lum-neo-textarea-field/lum-neo-textarea-field.component';

@Component({
  selector: 'app-lum-create-sanction-modal',
  imports: [ReactiveFormsModule, LumIconComponent, LumNeoTextareaFieldComponent],
  templateUrl: './lum-create-sanction-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCreateSanctionModalComponent {
  readonly form = input.required<FormGroup>();
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
