import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lum-filter-pill-button',
  imports: [],
  templateUrl: './lum-filter-pill-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumFilterPillButtonComponent {
  readonly label = input.required<string>();
  readonly selected = input(false);

  readonly pillSelected = output<void>();

  protected select(): void {
    this.pillSelected.emit();
  }
}
