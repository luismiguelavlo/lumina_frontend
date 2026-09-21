import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { SanctionRow } from '../../../models/sanction-row.model';
import type { SanctionsApiPagination } from '../../../models/sanctions-api.model';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumTableStudentIdentityCellComponent } from '../../molecules/lum-table-student-identity-cell/lum-table-student-identity-cell.component';

@Component({
  selector: 'app-lum-sanctions-active-table',
  imports: [LumIconComponent, LumTableStudentIdentityCellComponent, TranslatePipe],
  templateUrl: './lum-sanctions-active-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumSanctionsActiveTableComponent {
  readonly rows = input.required<readonly SanctionRow[]>();
  readonly pagination = input<SanctionsApiPagination | null>(null);

  readonly liftSanctionClick = output<SanctionRow>();
  readonly prevPageClick = output<void>();
  readonly nextPageClick = output<void>();

  protected onLift(row: SanctionRow): void {
    this.liftSanctionClick.emit(row);
  }

  protected onPrevPage(): void {
    this.prevPageClick.emit();
  }

  protected onNextPage(): void {
    this.nextPageClick.emit();
  }
}
