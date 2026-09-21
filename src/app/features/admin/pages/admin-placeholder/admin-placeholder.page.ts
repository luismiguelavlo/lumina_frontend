import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { I18nService } from '../../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-admin-placeholder-page',
  imports: [TranslatePipe],
  templateUrl: './admin-placeholder.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);

  private readonly routeTitle = toSignal(
    this.route.data.pipe(map((d) => d['title'] as string | undefined)),
    { initialValue: this.route.snapshot.data['title'] as string | undefined },
  );

  protected readonly title = computed(() => {
    this.i18n.locale();
    return this.routeTitle() ?? this.i18n.t('adminPlaceholder.fallbackTitle');
  });
}
