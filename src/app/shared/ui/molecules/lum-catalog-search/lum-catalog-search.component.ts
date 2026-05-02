import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-catalog-search',
  imports: [LumIconComponent],
  templateUrl: './lum-catalog-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumCatalogSearchComponent {
  readonly placeholder = input.required<string>();
  readonly query = input<string>('');
  readonly ariaLabel = input<string>('Search catalog');

  readonly queryChange = output<string>();

  protected onInput(value: string): void {
    this.queryChange.emit(value);
  }
}
