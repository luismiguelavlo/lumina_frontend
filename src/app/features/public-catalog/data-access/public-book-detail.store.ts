import { computed, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { PublicBooksApiError, PublicBooksApiService } from '../../../shared/data-access/public-books-api.service';
import type { PublicBookDetailApiResponse } from '../../../shared/models/public-books-api.model';
import type { PublicCatalogBookDetail } from '../../../shared/models/public-catalog.models';
import type { LumPublicCatalogFooterLink } from '../../../shared/ui/organisms/lum-public-catalog-site-footer/lum-public-catalog-site-footer.component';

interface DetailState {
  status: 'empty' | 'ok' | 'not_found' | 'error';
  detail?: PublicCatalogBookDetail;
  message?: string;
}

const COVER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80';

@Injectable()
export class PublicBookDetailStore {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly booksApi = inject(PublicBooksApiService);

  readonly footerLinks: readonly LumPublicCatalogFooterLink[] = [
    { label: 'Accessibility', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Contact Support', href: '#' },
  ];

  private readonly bookId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('bookId') ?? '')),
    { initialValue: '' },
  );

  private readonly detailState = toSignal(
    toObservable(this.bookId).pipe(
      switchMap((id) => {
        if (!id) return of<DetailState>({ status: 'empty' });
        return this.booksApi.getBookById(id).pipe(
          map((response) => ({ status: 'ok' as const, detail: this.mapApiToView(response) })),
          catchError((error: unknown) => {
            if (error instanceof PublicBooksApiError && error.code === 'not_found') {
              return of<DetailState>({ status: 'not_found' });
            }
            return of<DetailState>({
              status: 'error',
              message: 'No fue posible cargar el detalle del libro.',
            });
          }),
        );
      }),
    ),
    { initialValue: { status: 'empty' } },
  );

  readonly detail = computed<PublicCatalogBookDetail | null>(() => {
    const state = this.detailState();
    return state?.status === 'ok' ? (state.detail ?? null) : null;
  });

  readonly loadErrorMessage = computed<string | null>(() => {
    const state = this.detailState();
    return state?.status === 'error' ? (state.message ?? null) : null;
  });

  constructor() {
    toObservable(this.detailState)
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        if (!state) return;
        if (state.status === 'not_found') {
          void this.router.navigate(['/catalog']);
        }
        if (state.status === 'ok' && state.detail) {
          this.titleService.setTitle(`${state.detail.title} – Lumina Archive`);
        }
      });
  }

  private mapApiToView(api: PublicBookDetailApiResponse): PublicCatalogBookDetail {
    const primaryAuthor = api.authors?.[0]?.name ?? 'Unknown author';
    const primaryGenre = api.genres?.[0]?.name ?? 'General';

    return {
      bookId: api.id,
      breadcrumbCategory: primaryGenre,
      title: api.title,
      author: primaryAuthor,
      coverUrl: api.cover_url?.trim() || COVER_PLACEHOLDER,
      coverAlt: `Book cover for ${api.title}`,
      availability: api.status === 'available' ? 'available' : 'checked_out',
      secondaryBadgeLabel: primaryGenre,
      synopsis: api.synopsis?.trim() || 'No synopsis available for this title.',
      publishedYear: api.publication_year ? String(api.publication_year) : 'N/A',
      pageCount: api.pages ? String(api.pages) : 'N/A',
    };
  }
}
