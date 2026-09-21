import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { AuthBootstrapService } from './features/auth/data-access/auth-bootstrap.service';
import { authTokenInterceptor } from './features/auth/data-access/auth-token.interceptor';
import { ThemeService } from './shared/theme/theme.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const authBootstrap = inject(AuthBootstrapService);
        // Touch ThemeService so DOM class sync runs on boot (after inline FOUC script).
        inject(ThemeService);
        return () => authBootstrap.initialize();
      },
    },
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
