import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-student-admin-actions-bar',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-student-admin-actions-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentAdminActionsBarComponent {
  readonly heading = input<string | undefined>(undefined);
  readonly sanctionLabel = input<string | undefined>(undefined);
  readonly fineLabel = input<string | undefined>(undefined);
  readonly deactivateLabel = input<string | undefined>(undefined);
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
