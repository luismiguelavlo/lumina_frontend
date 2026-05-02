import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-lift-sanction-modal',
  imports: [LumIconComponent],
  templateUrl: './lum-lift-sanction-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLiftSanctionModalComponent {
  readonly studentName = input.required<string>();

  readonly cancelClick = output<void>();
  readonly confirmClick = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelClick.emit();
    }
  }
}
