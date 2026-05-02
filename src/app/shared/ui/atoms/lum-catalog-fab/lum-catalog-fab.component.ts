import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-catalog-fab',
  imports: [LumIconComponent],
  templateUrl: './lum-catalog-fab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCatalogFabComponent {
  readonly icon = input<string>('add');
  readonly ariaLabel = input.required<string>();

  readonly fabClick = output<void>();

  protected onClick(): void {
    this.fabClick.emit();
  }
}
