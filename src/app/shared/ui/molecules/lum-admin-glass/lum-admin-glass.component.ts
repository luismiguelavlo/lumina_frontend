import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-lum-admin-glass',
  imports: [],
  templateUrl: './lum-admin-glass.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumAdminGlassComponent {
  readonly paddingClass = input<string>('p-6');
  readonly roundedClass = input<string>('rounded-xl');
  readonly interactive = input(false);

  protected readonly hostClass = computed(() => {
    const base =
      'border border-white/30 bg-white/40 shadow-glass backdrop-blur-md dark:border-white/[0.05] dark:bg-[color-mix(in_oklab,var(--color-background-dark)_40%,transparent)] dark:shadow-[0_8px_32px_0_rgb(0_0_0/0.3)]';
    const hover = this.interactive()
      ? ' cursor-pointer transition-colors hover:bg-white/50 dark:hover:bg-black/20'
      : '';
    return `${base} ${this.roundedClass()} ${this.paddingClass()}${hover}`;
  });
}
