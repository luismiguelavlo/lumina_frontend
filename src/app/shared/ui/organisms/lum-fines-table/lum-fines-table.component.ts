import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { FineRow } from '../../../models/fine-row.model';
import type { FinesApiPagination } from '../../../models/fines-api.model';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumTableStudentIdentityCellComponent } from '../../molecules/lum-table-student-identity-cell/lum-table-student-identity-cell.component';
import { LumFineStatusPillComponent } from '../../molecules/lum-fine-status-pill/lum-fine-status-pill.component';

@Component({
  selector: 'app-lum-fines-table',
  imports: [
    LumIconComponent,
    LumFineStatusPillComponent,
    LumTableStudentIdentityCellComponent,
    TranslatePipe,
  ],
  templateUrl: './lum-fines-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFinesTableComponent {
  readonly rows = input.required<readonly FineRow[]>();
  readonly pagination = input<FinesApiPagination | null>(null);

  readonly markPaidClick = output<FineRow>();
  readonly markWaivedClick = output<FineRow>();
  readonly prevPageClick = output<void>();
  readonly nextPageClick = output<void>();

  protected onMarkPaid(row: FineRow): void {
    this.markPaidClick.emit(row);
  }

  protected onMarkWaived(row: FineRow): void {
    this.markWaivedClick.emit(row);
  }

  protected onPrevPage(): void {
    this.prevPageClick.emit();
  }

  protected onNextPage(): void {
    this.nextPageClick.emit();
  }
}
