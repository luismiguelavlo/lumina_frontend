import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { catchError, finalize, forkJoin, map, of, startWith, switchMap, take } from 'rxjs';
import { StudentProfileApiService } from '../../../../shared/data-access/student-profile-api.service';
import { StudentsApiService } from '../../../../shared/data-access/students-api.service';
import { BadgesApiService } from '../../../../shared/data-access/badges-api.service';
import { LoansApiService } from '../../../../shared/data-access/loans-api.service';
import { FinesApiService } from '../../../../shared/data-access/fines-api.service';
import { SanctionsApiService } from '../../../../shared/data-access/sanctions-api.service';
import { I18nService } from '../../../../shared/i18n/i18n.service';
import type { BadgeCatalogItem } from '../../../../shared/models/badges-api.model';
import type { ProfileBadgeTileData, StudentProfileDetail } from '../../../../shared/models/student-profile.model';
import type {
  StudentProfileApiResponse,
  StudentProfileBadgeApi,
} from '../../../../shared/models/student-profile-api.model';
import type { CreateStudentRequest } from '../../../../shared/models/students-api.model';
import type { LumSelectOption } from '../../../../shared/ui/molecules/lum-neo-select-field/lum-neo-select-field.component';
import type { CreateFineRequest } from '../../../../shared/models/fines-api.model';
import type { CreateSanctionRequest } from '../../../../shared/models/sanctions-api.model';

const AVATAR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80';
const BOOK_PLACEHOLDER =
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=320&q=80';

@Injectable()
export class StudentDetailStore {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileApi = inject(StudentProfileApiService);
  private readonly studentsApi = inject(StudentsApiService);
  private readonly badgesApi = inject(BadgesApiService);
  private readonly loansApi = inject(LoansApiService);
  private readonly finesApi = inject(FinesApiService);
  private readonly sanctionsApi = inject(SanctionsApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly refreshNonce = signal(0);

  private readonly studentId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('patronId') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('patronId') ?? '' },
  );

  readonly isEditModalOpen = signal(false);
  readonly isUpdating = signal(false);
  readonly isDeactivating = signal(false);
  readonly isFineModalOpen = signal(false);
  readonly isFineConfirmOpen = signal(false);
  readonly isFineCreating = signal(false);
  readonly isLoadingStudentLoans = signal(false);
  readonly isSanctionModalOpen = signal(false);
  readonly isSanctionConfirmOpen = signal(false);
  readonly isSanctionCreating = signal(false);
  readonly updateError = signal<string | null>(null);
  readonly updateSuccess = signal<string | null>(null);
  readonly deactivateError = signal<string | null>(null);
  readonly fineError = signal<string | null>(null);
  readonly sanctionError = signal<string | null>(null);
  readonly sanctionSuccess = signal<string | null>(null);
  readonly mutatingBadgeId = signal<string | null>(null);
  readonly badgeToast = signal<{ message: string; variant: 'success' | 'error' } | null>(null);

  private badgeToastClearHandle: ReturnType<typeof setTimeout> | null = null;

  readonly degreeOptions = computed((): readonly LumSelectOption[] => {
    this.i18n.locale();
    return [
      { value: 'Undergraduate Student', label: this.i18n.t('students.degree.undergraduate') },
      { value: 'Graduate Student', label: this.i18n.t('students.degree.graduate') },
      { value: 'Doctoral Student', label: this.i18n.t('students.degree.doctoral') },
      { value: 'Faculty', label: this.i18n.t('students.degree.faculty') },
    ];
  });

  readonly editForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    degreeLevel: ['Undergraduate Student', [Validators.required]],
    major: ['', [Validators.required, Validators.minLength(2)]],
    expectedGraduationYear: [new Date().getFullYear() + 1, [Validators.required, Validators.min(1900)]],
    avatarUrl: [''],
  });

  readonly createFineForm = this.fb.group({
    loanId: ['', [Validators.required]],
    amount: [12.5, [Validators.required, Validators.min(0.01)]],
    reason: ['', [Validators.required, Validators.minLength(5)]],
  });
  readonly createSanctionForm = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(5)]],
  });
  readonly activeLoanOptions = signal<readonly LumSelectOption[]>([]);

  private readonly queryState = computed(() => ({
    id: this.studentId(),
    nonce: this.refreshNonce(),
  }));

  private readonly profileState = toSignal(
    toObservable(this.queryState).pipe(
      switchMap(({ id }) => {
        if (!id) {
          return of({
            status: 'empty' as const,
            profile: this.fallbackProfile('—'),
            raw: null as StudentProfileApiResponse | null,
          });
        }
        return forkJoin({
          profileResp: this.profileApi.getProfile(id, 10),
          catalog: this.badgesApi.listBadges().pipe(catchError(() => of([] as readonly BadgeCatalogItem[]))),
        }).pipe(
          map(({ profileResp, catalog }) => ({
            status: 'ok' as const,
            profile: this.mapApiToView(profileResp, catalog),
            raw: profileResp,
          })),
          catchError(() =>
            of({
              status: 'error' as const,
              profile: this.fallbackProfile(id),
              raw: null as StudentProfileApiResponse | null,
            }),
          ),
          startWith({
            status: 'loading' as const,
            profile: null as StudentProfileDetail | null,
            raw: null as StudentProfileApiResponse | null,
          }),
        );
      }),
    ),
    {
      initialValue: {
        status: 'loading' as const,
        profile: null as StudentProfileDetail | null,
        raw: null as StudentProfileApiResponse | null,
      },
    },
  );

  readonly isProfileLoading = computed(() => {
    const s = this.profileState().status;
    return s === 'loading';
  });

  readonly profile = computed(() => this.profileState().profile ?? this.fallbackProfile(this.studentId() || '—'));
  private readonly rawProfile = computed(() => this.profileState().raw);
  readonly studentRouteId = computed(() => this.studentId());
  readonly badgeCountLabel = computed(() => {
    const p = this.profile();
    return `${p.badgeUnlocked}/${p.badgeTotal}`;
  });

  grantStudentBadge(badgeId: string): void {
    const studentId = this.studentRouteId();
    if (!studentId || this.mutatingBadgeId()) {
      return;
    }
    this.mutatingBadgeId.set(badgeId);
    this.studentsApi
      .awardBadge(studentId, badgeId)
      .pipe(
        take(1),
        finalize(() => this.mutatingBadgeId.set(null)),
      )
      .subscribe({
        next: () => {
          this.showBadgeToast(this.i18n.t('studentDetail.badges.added'), 'success');
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.showBadgeToast(this.toBadgeErrorMessage(error), 'error');
        },
      });
  }

  revokeStudentBadge(badgeId: string): void {
    const studentId = this.studentRouteId();
    if (!studentId || this.mutatingBadgeId()) {
      return;
    }
    this.mutatingBadgeId.set(badgeId);
    this.studentsApi
      .removeStudentBadge(studentId, badgeId)
      .pipe(
        take(1),
        finalize(() => this.mutatingBadgeId.set(null)),
      )
      .subscribe({
        next: () => {
          this.showBadgeToast(this.i18n.t('studentDetail.badges.removed'), 'success');
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.showBadgeToast(this.toBadgeErrorMessage(error), 'error');
        },
      });
  }

  dismissBadgeToast(): void {
    if (this.badgeToastClearHandle != null) {
      clearTimeout(this.badgeToastClearHandle);
      this.badgeToastClearHandle = null;
    }
    this.badgeToast.set(null);
  }

  private showBadgeToast(message: string, variant: 'success' | 'error'): void {
    if (this.badgeToastClearHandle != null) {
      clearTimeout(this.badgeToastClearHandle);
    }
    this.badgeToast.set({ message, variant });
    this.badgeToastClearHandle = setTimeout(() => {
      this.badgeToast.set(null);
      this.badgeToastClearHandle = null;
    }, 4200);
  }

  private toBadgeErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('studentDetail.badges.error');
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 409) {
      return this.i18n.t('studentDetail.badges.conflict');
    }

    if (error.status === 0) {
      return this.i18n.t('common.errors.network');
    }

    return this.i18n.t('studentDetail.badges.error');
  }

  openEditModal(): void {
    const raw = this.rawProfile();
    if (!raw) {
      this.updateError.set(this.i18n.t('studentDetail.errors.notReady'));
      return;
    }

    this.editForm.reset({
      firstName: raw.first_name ?? '',
      lastName: raw.last_name ?? '',
      email: raw.email ?? '',
      degreeLevel: raw.degree_level ?? 'Undergraduate Student',
      major: raw.major ?? '',
      expectedGraduationYear: raw.expected_graduation_year ?? new Date().getFullYear() + 1,
      avatarUrl: raw.avatar_url ?? '',
    });
    this.updateError.set(null);
    this.updateSuccess.set(null);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    if (this.isUpdating()) return;
    this.isEditModalOpen.set(false);
    this.updateError.set(null);
  }

  submitUpdate(): void {
    const id = this.studentRouteId();
    if (!id || this.isUpdating()) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.updateError.set(this.i18n.t('studentDetail.errors.validation'));
      return;
    }

    const v = this.editForm.getRawValue();
    const payload: CreateStudentRequest = {
      first_name: v.firstName.trim(),
      last_name: v.lastName.trim(),
      email: v.email.trim(),
      degree_level: v.degreeLevel,
      major: v.major.trim(),
      expected_graduation_year: Math.trunc(v.expectedGraduationYear),
      ...(v.avatarUrl.trim() ? { avatar_url: v.avatarUrl.trim() } : {}),
    };

    this.isUpdating.set(true);
    this.updateError.set(null);

    this.studentsApi
      .updateStudent(id, payload)
      .pipe(
        take(1),
        finalize(() => this.isUpdating.set(false)),
      )
      .subscribe({
        next: () => {
          this.isEditModalOpen.set(false);
          this.updateSuccess.set(this.i18n.t('studentDetail.success.updated'));
          this.deactivateError.set(null);
          this.refreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.updateError.set(this.toUpdateErrorMessage(error));
        },
      });
  }

  deactivateStudent(): void {
    const id = this.studentRouteId();
    if (!id || this.isDeactivating()) return;

    this.isDeactivating.set(true);
    this.deactivateError.set(null);
    this.updateSuccess.set(null);

    this.studentsApi
      .deleteStudent(id)
      .pipe(
        take(1),
        finalize(() => this.isDeactivating.set(false)),
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin', 'students']);
        },
        error: (error: unknown) => {
          this.deactivateError.set(this.toDeactivateErrorMessage(error));
        },
      });
  }

  openFineModal(): void {
    this.fineError.set(null);
    this.isFineConfirmOpen.set(false);
    this.createFineForm.reset({
      loanId: '',
      amount: 12.5,
      reason: '',
    });
    this.isFineModalOpen.set(true);
    this.loadActiveLoansForStudent();
  }

  openSanctionModal(): void {
    this.sanctionError.set(null);
    this.sanctionSuccess.set(null);
    this.isSanctionConfirmOpen.set(false);
    this.createSanctionForm.reset({ reason: '' });
    this.isSanctionModalOpen.set(true);
  }

  closeSanctionModal(): void {
    if (this.isSanctionCreating()) return;
    this.isSanctionModalOpen.set(false);
    this.isSanctionConfirmOpen.set(false);
    this.sanctionError.set(null);
  }

  requestSanctionConfirmation(): void {
    if (this.createSanctionForm.invalid) {
      this.createSanctionForm.markAllAsTouched();
      this.sanctionError.set(this.i18n.t('studentDetail.sanction.validation'));
      return;
    }
    this.sanctionError.set(null);
    this.isSanctionConfirmOpen.set(true);
  }

  cancelSanctionConfirmation(): void {
    if (this.isSanctionCreating()) return;
    this.isSanctionConfirmOpen.set(false);
  }

  confirmCreateSanction(): void {
    const studentId = this.studentRouteId();
    if (!studentId || this.createSanctionForm.invalid || this.isSanctionCreating()) {
      return;
    }

    const raw = this.createSanctionForm.getRawValue();
    const payload: CreateSanctionRequest = {
      student_id: studentId,
      reason: raw.reason.trim(),
    };

    this.isSanctionCreating.set(true);
    this.sanctionError.set(null);
    this.sanctionSuccess.set(null);

    this.sanctionsApi
      .createSanction(payload)
      .pipe(
        take(1),
        finalize(() => this.isSanctionCreating.set(false)),
      )
      .subscribe({
        next: () => {
          this.isSanctionModalOpen.set(false);
          this.isSanctionConfirmOpen.set(false);
          this.sanctionSuccess.set(this.i18n.t('studentDetail.sanction.success'));
          setTimeout(() => {
            void this.router.navigate(['/admin', 'sanctions']);
          }, 700);
        },
        error: (error: unknown) => {
          this.sanctionError.set(this.toSanctionErrorMessage(error));
        },
      });
  }

  closeFineModal(): void {
    if (this.isFineCreating()) return;
    this.isFineModalOpen.set(false);
    this.isFineConfirmOpen.set(false);
    this.fineError.set(null);
  }

  requestFineConfirmation(): void {
    if (this.createFineForm.invalid) {
      this.createFineForm.markAllAsTouched();
      this.fineError.set(this.i18n.t('studentDetail.fine.validation'));
      return;
    }
    this.fineError.set(null);
    this.isFineConfirmOpen.set(true);
  }

  cancelFineConfirmation(): void {
    if (this.isFineCreating()) return;
    this.isFineConfirmOpen.set(false);
  }

  confirmCreateFine(): void {
    const studentId = this.studentRouteId();
    if (!studentId || this.createFineForm.invalid || this.isFineCreating()) {
      return;
    }

    const raw = this.createFineForm.getRawValue();
    const payload: CreateFineRequest = {
      loan_id: raw.loanId,
      student_id: studentId,
      amount: Number(raw.amount),
      reason: raw.reason.trim(),
    };

    this.isFineCreating.set(true);
    this.fineError.set(null);

    this.finesApi
      .createFine(payload)
      .pipe(
        take(1),
        finalize(() => this.isFineCreating.set(false)),
      )
      .subscribe({
        next: () => {
          this.isFineModalOpen.set(false);
          this.isFineConfirmOpen.set(false);
          void this.router.navigate(['/admin', 'fines']);
        },
        error: (error: unknown) => {
          this.fineError.set(this.toFineErrorMessage(error));
        },
      });
  }

  private mapApiToView(api: StudentProfileApiResponse, catalog: readonly BadgeCatalogItem[]): StudentProfileDetail {
    const fullName = `${api.first_name} ${api.last_name}`.trim();
    const subtitle = [api.degree_level, api.major].filter(Boolean).join(' — ') || api.email;
    const memberSinceLabel = this.i18n.t('studentDetail.memberSince', {
      date: this.formatMemberSince(api.member_since),
    });

    const earnedIds = new Set(
      (api.badge_gallery.badges ?? []).filter((b) => b.earned).map((b) => b.id),
    );

    let badges: readonly ProfileBadgeTileData[];
    let badgeUnlocked: number;
    let badgeTotal: number;

    if (catalog.length > 0) {
      badges = catalog.map((def) => {
        const earned = earnedIds.has(def.id);
        return {
          id: def.id,
          slug: def.slug,
          icon: this.badgeIconFromSlug(def.slug, earned),
          label: def.name,
          locked: !earned,
          description: def.description,
          criteria: def.criteria,
        };
      });
      badgeUnlocked = badges.filter((b) => !b.locked).length;
      badgeTotal = badges.length;
    } else {
      badges = (api.badge_gallery.badges ?? []).map((badge) => ({
        id: badge.id,
        slug: badge.slug,
        icon: this.badgeIcon(badge),
        label: badge.name,
        locked: !badge.earned,
        description: badge.description,
        criteria: badge.criteria,
      }));
      badgeUnlocked = api.badge_gallery.earned_count ?? 0;
      badgeTotal = api.badge_gallery.total_badges ?? badges.length;
    }

    return {
      patronId: api.student_id_code || api.id,
      name: fullName || this.i18n.t('studentDetail.fallback.patron'),
      subtitle,
      memberSinceLabel,
      avatarUrl: api.avatar_url?.trim() || AVATAR_PLACEHOLDER,
      avatarAlt: this.i18n.t('students.avatarAlt', {
        name: fullName || this.i18n.t('studentDetail.fallback.patron'),
      }),
      verified: true,
      stats: [
        {
          label: this.i18n.t('studentDetail.stats.totalRead'),
          value: String(api.personal_stats.total_read ?? 0),
          icon: 'menu_book',
          accent: 'primary',
        },
        {
          label: this.i18n.t('studentDetail.stats.active'),
          value: String(api.personal_stats.active_loans ?? 0),
          icon: 'bookmark',
          accent: 'primary',
        },
        {
          label: this.i18n.t('studentDetail.stats.overdue'),
          value: String(api.personal_stats.overdue_count ?? 0),
          icon: 'warning',
          accent: (api.personal_stats.overdue_count ?? 0) > 0 ? 'danger' : 'neutral',
        },
        {
          label: this.i18n.t('studentDetail.stats.streak'),
          value: String(api.personal_stats.current_streak_days ?? 0),
          icon: 'local_fire_department',
          accent: 'primary',
          valueSuffix: 'd',
        },
      ],
      badges,
      badgeUnlocked,
      badgeTotal,
      loans: (api.loan_history ?? []).map((loan) => {
        const returned = Boolean(loan.returned_at);
        return {
          coverUrl: loan.cover_url?.trim() || BOOK_PLACEHOLDER,
          coverAlt: loan.title
            ? this.i18n.t('bookDetail.coverAltNamed', { title: loan.title })
            : this.i18n.t('studentDetail.loanFallbacks.bookCover'),
          title: loan.title ?? this.i18n.t('studentDetail.loanFallbacks.libraryBook'),
          authors: loan.authors ?? this.i18n.t('studentDetail.loanFallbacks.unknownAuthor'),
          statusLabel: returned
            ? this.i18n.t('studentDetail.loanStatus.returned')
            : this.i18n.t('studentDetail.loanStatus.active'),
          tone: returned ? 'returned' : 'active',
          primaryDateLabel: loan.borrowed_at
            ? this.i18n.t('studentDetail.loanDates.borrowed', {
                date: this.formatDate(loan.borrowed_at),
              })
            : this.i18n.t('studentDetail.loanDates.borrowedLabel'),
          dueDateLabel:
            !returned && loan.due_at
              ? this.i18n.t('studentDetail.loanDates.due', { date: this.formatDate(loan.due_at) })
              : undefined,
          dateRangeLabel:
            returned && loan.borrowed_at && loan.returned_at
              ? `${this.formatDate(loan.borrowed_at)} - ${this.formatDate(loan.returned_at)}`
              : undefined,
          timelineDotActive: !returned,
        };
      }),
    };
  }

  private fallbackProfile(patronId: string): StudentProfileDetail {
    return {
      patronId,
      name: this.i18n.t('studentDetail.fallback.patron'),
      subtitle: this.i18n.t('studentDetail.fallback.profile'),
      memberSinceLabel: this.i18n.t('studentDetail.memberSinceEmpty'),
      avatarUrl: AVATAR_PLACEHOLDER,
      avatarAlt: this.i18n.t('studentDetail.fallback.picture'),
      verified: true,
      stats: [
        {
          label: this.i18n.t('studentDetail.stats.totalRead'),
          value: '0',
          icon: 'menu_book',
          accent: 'primary',
        },
        {
          label: this.i18n.t('studentDetail.stats.active'),
          value: '0',
          icon: 'bookmark',
          accent: 'primary',
        },
        {
          label: this.i18n.t('studentDetail.stats.overdue'),
          value: '0',
          icon: 'warning',
          accent: 'neutral',
        },
        {
          label: this.i18n.t('studentDetail.stats.streak'),
          value: '0',
          icon: 'local_fire_department',
          accent: 'primary',
          valueSuffix: 'd',
        },
      ],
      badges: [],
      badgeUnlocked: 0,
      badgeTotal: 0,
      loans: [],
    };
  }

  private formatMemberSince(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  private badgeIcon(badge: StudentProfileBadgeApi): string {
    return this.badgeIconFromSlug(badge.slug, badge.earned);
  }

  private badgeIconFromSlug(slug: string, earned: boolean): string {
    switch (slug) {
      case 'bookworm':
        return 'import_contacts';
      case 'collector':
        return 'collections_bookmark';
      case 'explorer':
        return 'explore';
      case 'night_owl':
        return 'bedtime';
      case 'punctual_reader':
        return 'schedule';
      case 'reviewer':
        return 'rate_review';
      default:
        return earned ? 'workspace_premium' : 'lock';
    }
  }

  private toUpdateErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('studentDetail.errors.update');
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return this.i18n.t('common.errors.network');
    }

    return this.i18n.t('studentDetail.errors.update');
  }

  private toDeactivateErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('studentDetail.errors.deactivate');
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return this.i18n.t('common.errors.network');
    }

    return this.i18n.t('studentDetail.errors.deactivate');
  }

  private loadActiveLoansForStudent(): void {
    const studentId = this.studentRouteId();
    if (!studentId) {
      this.activeLoanOptions.set([]);
      this.fineError.set(this.i18n.t('studentDetail.fine.noStudentId'));
      return;
    }

    this.isLoadingStudentLoans.set(true);
    this.loansApi
      .listLoans({ limit: 20, offset: 0, student_id: studentId })
      .pipe(
        take(1),
        finalize(() => this.isLoadingStudentLoans.set(false)),
      )
      .subscribe({
        next: (response) => {
          const options = response.data
            .filter((loan) => (loan.status ?? '').toLowerCase() === 'active')
            .map((loan) => {
              const title = loan.book_title?.trim() || this.i18n.t('loans.untitled');
              const due = loan.due_date ?? '—';
              return {
                value: loan.loan_id,
                label: `${title} · ${this.i18n.t('studentDetail.loanDates.due', { date: due })}`,
              };
            });
          this.activeLoanOptions.set(options);
          if (options.length > 0) {
            this.createFineForm.controls.loanId.setValue(options[0].value);
          } else {
            this.fineError.set(this.i18n.t('studentDetail.fine.noActiveLoans'));
          }
        },
        error: (error: unknown) => {
          this.activeLoanOptions.set([]);
          this.fineError.set(this.toFineErrorMessage(error));
        },
      });
  }

  private toFineErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('studentDetail.fine.error');
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    if (error.status === 0) {
      return this.i18n.t('common.errors.network');
    }
    return this.i18n.t('studentDetail.fine.error');
  }

  private toSanctionErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.i18n.t('studentDetail.sanction.error');
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    if (error.status === 0) {
      return this.i18n.t('common.errors.network');
    }
    return this.i18n.t('studentDetail.sanction.error');
  }
}
