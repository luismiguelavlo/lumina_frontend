import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import type { ActivityItemModel } from '../../../../shared/models/dashboard.models';
import type { AnalyticsDashboardApiResponse } from '../../../../shared/models/analytics-dashboard-api.model';
import { AnalyticsApiService } from '../../../../shared/data-access/analytics-api.service';
import { LumDashboardPageHeaderComponent } from '../../../../shared/ui/organisms/lum-dashboard-page-header/lum-dashboard-page-header.component';
import { LumRecentActivityComponent } from '../../../../shared/ui/organisms/lum-recent-activity/lum-recent-activity.component';

@Component({
  selector: 'app-activity-history-page',
  imports: [LumDashboardPageHeaderComponent, LumRecentActivityComponent],
  template: `
    <app-lum-dashboard-page-header
      [subtitle]="subtitle"
      title="Activity History"
      (notificationsClick)="onNotificationsClick()"
    />

    @if (loadError(); as message) {
      <div
        class="mb-4 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ message }}
      </div>
    }

    <app-lum-recent-activity
      [items]="activityItems()"
      sectionTitle="All Events"
      viewAllLabel="Back to Dashboard"
      (viewAllClick)="onViewAllActivity()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityHistoryPage {
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly router = inject(Router);

  protected readonly subtitle = 'Complete timeline of platform events.';
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

  protected readonly activityItems = computed((): readonly ActivityItemModel[] =>
    this.dashboardData().recent_activity.map((activity, index, all) => ({
      icon: this.activityIcon(activity.event_type),
      tone: this.activityTone(activity.event_type),
      title: activity.title || 'Activity',
      subtitle: this.activitySubtitle(activity),
      time: this.timeAgo(activity.created_at),
      showConnector: index < all.length - 1,
    })),
  );

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
    return 'No details';
  }

  private timeAgo(value: string): string {
    const createdAt = new Date(value);
    if (Number.isNaN(createdAt.getTime())) return 'Now';
    const diffMs = Date.now() - createdAt.getTime();
    const minuteMs = 60_000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;
    if (diffMs < minuteMs) return 'Just now';
    if (diffMs < hourMs) return `${Math.floor(diffMs / minuteMs)} min ago`;
    if (diffMs < dayMs) return `${Math.floor(diffMs / hourMs)} h ago`;
    return `${Math.floor(diffMs / dayMs)} d ago`;
  }

  private toErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Could not load activity history.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return 'Could not load activity history.';
  }
}
