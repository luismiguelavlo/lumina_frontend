import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';
import { LumStudentsNeoSearchComponent } from '../../molecules/lum-students-neo-search/lum-students-neo-search.component';

@Component({
  selector: 'app-lum-students-page-toolbar',
  imports: [LumIconComponent, LumStudentsNeoSearchComponent],
  templateUrl: './lum-students-page-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumStudentsPageToolbarComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly addButtonLabel = input.required<string>();
  readonly searchPlaceholder = input.required<string>();
  readonly searchQuery = input<string>('');

  readonly searchQueryChange = output<string>();
  readonly addStudentClick = output<void>();
}
