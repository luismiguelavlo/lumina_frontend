import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-confirm-action-modal',
  imports: [LumIconComponent],
  templateUrl: './lum-confirm-action-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumConfirmActionModalComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly isLoading = input(false);

  readonly cancelClick = output<void>();
  readonly confirmClick = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isLoading()) {
      this.cancelClick.emit();
    }
  }
}
