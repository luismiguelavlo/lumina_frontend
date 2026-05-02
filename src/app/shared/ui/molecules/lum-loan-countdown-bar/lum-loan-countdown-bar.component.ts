import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { LoanTimeUrgency } from '../../../models/loan-row.model';

@Component({
  selector: 'app-lum-loan-countdown-bar',
  imports: [],
  templateUrl: './lum-loan-countdown-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumLoanCountdownBarComponent {
  readonly daysLeftLabel = input.required<string>();
  readonly progressPercent = input.required<number>();
  readonly urgency = input<LoanTimeUrgency>('safe');

  protected clampPercent(): number {
    const n = this.progressPercent();
    return Math.min(100, Math.max(0, n));
  }

  protected daysLabelClass(u: LoanTimeUrgency): string {
    if (u === 'critical') {
      return 'text-xs font-bold text-red-600 dark:text-red-400';
    }
    return 'text-xs font-bold text-slate-800 dark:text-slate-200';
  }

  protected barFillClass(u: LoanTimeUrgency): string {
    switch (u) {
      case 'critical':
        return 'rounded-full bg-gradient-to-r from-primary to-red-500 shadow-[0_0_10px_rgba(230,57,70,0.45)]';
      case 'warning':
        return 'rounded-full bg-gradient-to-r from-amber-200 to-primary';
      case 'very_safe':
        return 'rounded-full bg-amber-200/70 dark:bg-amber-900/50';
      default:
        return 'rounded-full bg-primary/70 dark:bg-primary/50';
    }
  }
}
