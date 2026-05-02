import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-public-book-detail-synopsis-panel',
  imports: [LumIconComponent],
  templateUrl: './lum-public-book-detail-synopsis-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicBookDetailSynopsisPanelComponent {
  readonly heading = input<string>('Synopsis');
  readonly body = input.required<string>();
}
