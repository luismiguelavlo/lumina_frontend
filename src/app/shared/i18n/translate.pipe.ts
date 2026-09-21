import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService, type TranslationParams } from './i18n.service';

/** Reactive translate pipe — re-evaluates when locale changes. */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: TranslationParams): string {
    this.i18n.locale();
    return this.i18n.t(key, params);
  }
}
