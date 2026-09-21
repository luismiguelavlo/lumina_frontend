import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import type { ActivityItemModel } from '../../../../shared/models/dashboard.models';
import type { AnalyticsDashboardApiResponse } from '../../../../shared/models/analytics-dashboard-api.model';
import { I18nService } from '../../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { AnalyticsApiService } from '../../../../shared/data-access/analytics-api.service';
import { LumDashboardPageHeaderComponent } from '../../../../shared/ui/organisms/lum-dashboard-page-header/lum-dashboard-page-header.component';
import { LumRecentActivityComponent } from '../../../../shared/ui/organisms/lum-recent-activity/lum-recent-activity.component';

@Component({
  selector: 'app-activity-history-page',
  imports: [LumDashboardPageHeaderComponent, LumRecentActivityComponent, TranslatePipe],
  templateUrl: './activity-history.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityHistoryPage {
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  protected readonly loadError = signal<string | null>(null);

  private readonly dashboardData = toSignal(
    this.analyticsApi.getDashboard().pipe(
      map((response) => {
        this.loadError.set(null);
        return response;
      }),
      catchError((error: unknown) => {
        this.loadError.set(this.toErrorMessage(error));
        return of(this.emptyDashboard());
      }),
    ),
    { initialValue: this.emptyDashboard() },
  );

  protected readonly activityItems = computed((): readonly ActivityItemModel[] => {
    this.i18n.locale();
    return this.dashboardData().recent_activity.map((activity, index, all) => ({
      icon: this.activityIcon(activity.event_type),
      tone: this.activityTone(activity.event_type),
      title: activity.title || this.i18n.t('dashboard.activity.fallbackTitle'),
      subtitle: this.activitySubtitle(activity),
      time: this.timeAgo(activity.created_at),
      showConnector: index < all.length - 1,
    }));
  });

  protected onNotificationsClick(): void {
    // Reserved for future notifications panel.
  }

  protected async onViewAllActivity(): Promise<void> {
    await this.router.navigate(['/admin', 'dashboard']);
  }

  private emptyDashboard(): AnalyticsDashboardApiResponse {
    return {
      total_books: 0,
      active_students: 0,
      overdue_fines: 0,
      most_borrowed_books: [],
      recent_activity: [],
    };
  }

  private activityIcon(eventType: string): string {
    if (eventType.includes('returned')) return 'book';
    if (eventType.includes('loan') || eventType.includes('borrow')) return 'menu_book';
    if (eventType.includes('fine')) return 'payments';
    return 'notifications';
  }

  private activityTone(eventType: string): ActivityItemModel['tone'] {
    if (eventType.includes('returned')) return 'green';
    if (eventType.includes('fine') || eventType.includes('overdue')) return 'red';
    return 'blue';
  }

  private activitySubtitle(activity: AnalyticsDashboardApiResponse['recent_activity'][number]): string {
    const detail = activity.description?.trim();
    if (detail) return detail;
    if (activity.student_name) return activity.student_name;
    if (activity.actor_name) return activity.actor_name;
    return this.i18n.t('dashboard.activity.noDetails');
  }

  private timeAgo(value: string): string {
    const createdAt = new Date(value);
    if (Number.isNaN(createdAt.getTime())) return this.i18n.t('dashboard.time.now');
    const diffMs = Date.now() - createdAt.getTime();
    const minuteMs = 60_000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;
    if (diffMs < minuteMs) return this.i18n.t('dashboard.time.justNow');
    if (diffMs < hourMs) return this.i18n.t('dashboard.time.minutesAgo', { n: Math.floor(diffMs / minuteMs) });
    if (diffMs < dayMs) return this.i18n.t('dashboard.time.hoursAgo', { n: Math.floor(diffMs / hourMs) });
    return this.i18n.t('dashboard.time.daysAgo', { n: Math.floor(diffMs / dayMs) });
  }

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('activityHistory.errors.load');
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return this.i18n.t('activityHistory.errors.load');
  }
}
