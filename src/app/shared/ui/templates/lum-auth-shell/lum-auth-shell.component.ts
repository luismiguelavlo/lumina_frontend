import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lum-auth-shell',
  imports: [],
  templateUrl: './lum-auth-shell.component.html',
  host: {
    class:
      'relative flex min-h-screen items-center justify-center overflow-hidden bg-background-light p-4 font-display text-text-dark antialiased dark:bg-background-dark dark:text-text-light sm:p-8',
    '[class.dark]': 'darkMode()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumAuthShellComponent {
  readonly darkMode = input(false);
}
