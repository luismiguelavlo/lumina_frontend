import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { BorrowedBarModel } from '../../../models/dashboard.models';
import { LumAdminGlassComponent } from '../../molecules/lum-admin-glass/lum-admin-glass.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-borrowed-books-chart',
  imports: [LumAdminGlassComponent, LumIconComponent],
  templateUrl: './lum-borrowed-books-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBorrowedBooksChartComponent {
  readonly headingTitle = input.required<string>();
  readonly headingSubtitle = input.required<string>();
  readonly reportLabel = input.required<string>();
  readonly reportHref = input('#');

  readonly bars = input.required<readonly BorrowedBarModel[]>();

  protected readonly yAxisLabels = ['100', '75', '50', '25', '0'] as const;
}
