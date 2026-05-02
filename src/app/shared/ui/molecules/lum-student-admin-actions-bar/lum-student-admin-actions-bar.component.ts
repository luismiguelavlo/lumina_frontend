import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-student-admin-actions-bar',
  imports: [LumIconComponent],
  templateUrl: './lum-student-admin-actions-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentAdminActionsBarComponent {
  readonly heading = input<string>('Administrative actions');

  readonly sanctionLabel = input<string>('Start sanction');
  readonly fineLabel = input<string>('Start fine');
  readonly deactivateLabel = input<string>('Deactivate user');
  readonly deactivateLoading = input(false);

  readonly sanctionClick = output<void>();
  readonly fineClick = output<void>();
  readonly deactivateClick = output<void>();

  protected emitSanction(): void {
    this.sanctionClick.emit();
  }

  protected emitFine(): void {
    this.fineClick.emit();
  }

  protected emitDeactivate(): void {
    this.deactivateClick.emit();
  }
}
