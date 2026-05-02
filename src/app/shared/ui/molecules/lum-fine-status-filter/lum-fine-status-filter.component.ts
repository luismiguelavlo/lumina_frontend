import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { FineStatusFilter } from '../../../models/fine-row.model';

@Component({
  selector: 'app-lum-fine-status-filter',
  imports: [],
  templateUrl: './lum-fine-status-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFineStatusFilterComponent {
  readonly active = input.required<FineStatusFilter>();

  readonly filterChange = output<FineStatusFilter>();

  protected select(value: FineStatusFilter): void {
    this.filterChange.emit(value);
  }

  protected isActive(value: FineStatusFilter): boolean {
    return this.active() === value;
  }
}
