import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-placeholder-page',
  imports: [],
  templateUrl: './admin-placeholder.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((d) => (d['title'] as string) ?? 'Admin')),
    { initialValue: (this.route.snapshot.data['title'] as string) ?? 'Admin' },
  );
}
