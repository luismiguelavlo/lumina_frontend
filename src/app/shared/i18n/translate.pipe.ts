import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

/** Reactive translate pipe — re-evaluates when locale changes via the locale signal read inside. */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string): string {
    // Touch locale so impure pipe refreshes when language changes.
    this.i18n.locale();
    return this.i18n.t(key);
  }
}
