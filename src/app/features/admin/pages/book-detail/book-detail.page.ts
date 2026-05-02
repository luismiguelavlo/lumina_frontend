import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LumBookCoverColumnComponent } from '../../../../shared/ui/organisms/lum-book-cover-column/lum-book-cover-column.component';
import { LumBookEditorFormComponent } from '../../../../shared/ui/organisms/lum-book-editor-form/lum-book-editor-form.component';
import { LumBookEditorHeaderComponent } from '../../../../shared/ui/organisms/lum-book-editor-header/lum-book-editor-header.component';
import { AdminBookDetailStore } from './book-detail.store';

@Component({
  selector: 'app-book-detail-page',
  imports: [
    ReactiveFormsModule,
    LumBookCoverColumnComponent,
    LumBookEditorHeaderComponent,
    LumBookEditorFormComponent,
  ],
  providers: [AdminBookDetailStore],
  templateUrl: './book-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailPage {
  protected readonly store = inject(AdminBookDetailStore);
}
