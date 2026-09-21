import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

@Component({
  selector: 'app-lum-book-editor-header',
  imports: [LumIconComponent, TranslatePipe],
  templateUrl: './lum-book-editor-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumBookEditorHeaderComponent {
  readonly title = input.required<string>();
  readonly libraryId = input.required<string>();
  readonly saving = input(false);

  readonly discardClick = output<void>();
  readonly saveClick = output<void>();
}
