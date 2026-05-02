import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { FineStatusFilter } from '../../../models/fine-row.model';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumFineStatusFilterComponent } from '../../molecules/lum-fine-status-filter/lum-fine-status-filter.component';

@Component({
  selector: 'app-lum-fines-filters-bar',
  imports: [LumIconComponent, LumFineStatusFilterComponent],
  templateUrl: './lum-fines-filters-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFinesFiltersBarComponent {
  readonly activeFilter = input.required<FineStatusFilter>();
  readonly studentIdQuery = input.required<string>();

  readonly filterChange = output<FineStatusFilter>();
  readonly studentIdQueryChange = output<string>();

  protected onStudentInput(value: string): void {
    this.studentIdQueryChange.emit(value);
  }
}
