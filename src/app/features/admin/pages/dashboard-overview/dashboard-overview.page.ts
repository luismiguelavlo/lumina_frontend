import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import type {
  ActivityItemModel,
  BorrowedBarModel,
  StatCardModel,
} from '../../../../shared/models/dashboard.models';
import type { AnalyticsDashboardApiResponse } from '../../../../shared/models/analytics-dashboard-api.model';
import { AnalyticsApiService } from '../../../../shared/data-access/analytics-api.service';
import { LumBorrowedBooksChartComponent } from '../../../../shared/ui/organisms/lum-borrowed-books-chart/lum-borrowed-books-chart.component';
import { LumDashboardPageHeaderComponent } from '../../../../shared/ui/organisms/lum-dashboard-page-header/lum-dashboard-page-header.component';
import { LumRecentActivityComponent } from '../../../../shared/ui/organisms/lum-recent-activity/lum-recent-activity.component';
import { LumStatSummaryCardComponent } from '../../../../shared/ui/organisms/lum-stat-summary-card/lum-stat-summary-card.component';

@Component({
  selector: 'app-dashboard-overview-page',
  imports: [
    LumDashboardPageHeaderComponent,
    LumStatSummaryCardComponent,
    LumBorrowedBooksChartComponent,
    LumRecentActivityComponent,
  ],
  templateUrl: './dashboard-overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOverviewPage {
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly router = inject(Router);

  protected readonly overviewSubtitle = "Welcome back! Here's what's happening today.";
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

  protected readonly statCards = computed((): readonly StatCardModel[] => {
    const data = this.dashboardData();
    return [
      {
        title: 'Total Books',
        value: this.numberLabel(data.total_books),
        icon: 'library_books',
        accent: 'primary',
        trendDirection: 'up',
        trendLabel: 'Live',
        footnote: 'in catalog',
      },
      {
        title: 'Active Students',
        value: this.numberLabel(data.active_students),
        icon: 'group',
        accent: 'blue',
        trendDirection: 'up',
        trendLabel: 'Live',
        footnote: 'currently active',
      },
      {
        title: 'Overdue Fines',
        value: this.numberLabel(data.overdue_fines),
        icon: 'payments',
        accent: 'red',
        trendDirection: data.overdue_fines > 0 ? 'up' : 'down',
        trendLabel: data.overdue_fines > 0 ? 'Pending' : 'Clear',
        footnote: 'with overdue status',
      },
    ] as const;
  });

  protected readonly borrowedBars = computed((): readonly BorrowedBarModel[] => {
    const books = this.dashboardData().most_borrowed_books;
    const maxBorrowCount = Math.max(...books.map((book) => Math.max(1, book.borrow_count)), 1);

    return books.slice(0, 5).map((book, index) => ({
      shortLabel: this.shortBookLabel(book.title),
      fullTitle: book.title,
      heightPct: Math.max(12, Math.round((book.borrow_count / maxBorrowCount) * 100)),
      highlight: index === 0,
    }));
  });

  protected readonly activityItems = computed((): readonly ActivityItemModel[] =>
    this.dashboardData().recent_activity.slice(0, 4).map((activity, index, all) => ({
      icon: this.activityIcon(activity.event_type),
      tone: this.activityTone(activity.event_type),
      title: activity.title || 'Activity',
      subtitle: this.activitySubtitle(activity),
      time: this.timeAgo(activity.created_at),
      showConnector: index < all.length - 1,
    })),
  );

  protected onNotificationsClick(): void {
    // Wire to notifications panel / service when available.
  }

  protected async onViewAllActivity(): Promise<void> {
    await this.router.navigate(['/admin', 'activity']);
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

  private shortBookLabel(title: string): string {
    return title.length <= 12 ? title : `${title.slice(0, 12)}...`;
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

  private numberLabel(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
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
      return 'Could not load dashboard analytics.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    return 'Could not load dashboard analytics.';
  }
}
