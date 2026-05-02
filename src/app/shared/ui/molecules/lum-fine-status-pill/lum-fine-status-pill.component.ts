import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FineStatusFilter } from '../../../models/fine-row.model';

@Component({
  selector: 'app-lum-fine-status-pill',
  imports: [],
  templateUrl: './lum-fine-status-pill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFineStatusPillComponent {
  readonly status = input.required<FineStatusFilter>();
}
