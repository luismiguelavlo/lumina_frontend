import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, startWith, switchMap } from 'rxjs';
import type {
  PublicCatalogAvailability,
  PublicCatalogBook,
  PublicCatalogFilterId,
  PublicCatalogSortId,
} from '../../../shared/models/public-catalog.models';
import type { PublicBooksApiResponse, PublicBooksPagination } from '../../../shared/models/public-books-api.model';
import { PublicBooksApiService } from '../../../shared/data-access/public-books-api.service';
import { PublicGenresApiService } from '../../../shared/data-access/public-genres-api.service';
import type {
  LumPublicCatalogFilterOption,
  LumPublicCatalogSortOption,
} from '../../../shared/ui/organisms/lum-public-catalog-filters-bar/lum-public-catalog-filters-bar.component';
import type { LumPublicCatalogFooterLink } from '../../../shared/ui/organisms/lum-public-catalog-site-footer/lum-public-catalog-site-footer.component';

const PAGE_SIZE = 20;
const COVER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80';

@Injectable()
export class PublicCatalogStore {
  private readonly booksApi = inject(PublicBooksApiService);
  private readonly genresApi = inject(PublicGenresApiService);

  private readonly currentPage = signal(1);
  private readonly isBooksLoadingState = signal(false);

  readonly searchControl = new FormControl<string | null>('');
  readonly selectedFilter = signal<PublicCatalogFilterId>('all');
  readonly selectedSort = signal<PublicCatalogSortId>('relevance');

  readonly sortOptions: readonly LumPublicCatalogSortOption[] = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'title', label: 'Title (A-Z)' },
    { id: 'date', label: 'Date Added' },
  ];

  readonly footerLinks: readonly LumPublicCatalogFooterLink[] = [
    { label: 'Accessibility', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Contact Support', href: '#' },
  ];

  private readonly searchText = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(250),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  private readonly genresFromApi = toSignal(
    this.genresApi.getGenres().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  readonly filterOptions = computed<readonly LumPublicCatalogFilterOption[]>(() => {
    const fromApi = this.genresFromApi().map((genre) => ({ id: genre.id, label: genre.name }));
    const deduped = Array.from(new Map(fromApi.map((g) => [g.id, g])).values());
    return [{ id: 'all', label: 'All' }, ...deduped];
  });

  private readonly booksQuery = computed(() => ({
    limit: PAGE_SIZE,
    offset: (this.currentPage() - 1) * PAGE_SIZE,
    search: (this.searchText() ?? '').trim(),
    genreId: this.selectedFilter() === 'all' ? undefined : this.selectedFilter(),
  }));

  private readonly booksResponse = toSignal(
    toObservable(this.booksQuery).pipe(
      switchMap((query) => {
        this.isBooksLoadingState.set(true);
        return this.booksApi.listBooks(query).pipe(
          catchError(() => of(this.emptyResponse(query.limit, query.offset))),
          finalize(() => this.isBooksLoadingState.set(false)),
        );
      }),
    ),
    { initialValue: this.emptyResponse(PAGE_SIZE, 0) },
  );

  readonly books = computed<readonly PublicCatalogBook[]>(() => {
    const rows = this.booksResponse().data ?? [];
    const selectedGenre = this.selectedFilter();
    const currentGenreLabel = this.filterOptions().find((o) => o.id === selectedGenre)?.label ?? 'General';

    let mapped: PublicCatalogBook[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      genreId: row.genre_id,
      categoryLabel: row.genre_name ?? currentGenreLabel,
      categoryTextClass: 'text-slate-600 dark:text-slate-300',
      coverUrl: row.cover_url || COVER_PLACEHOLDER,
      coverAlt: `Book cover for ${row.title}`,
      availability: this.mapAvailability(row.status),
      addedAt: Date.now(),
    }));

    if (this.selectedSort() === 'title') {
      mapped = mapped.sort((a, b) => a.title.localeCompare(b.title));
    }

    return mapped;
  });

  readonly pagination = computed<PublicBooksPagination>(() => this.booksResponse().pagination);
  readonly isBooksLoading = computed(() => this.isBooksLoadingState());

  onFilterChange(id: PublicCatalogFilterId): void {
    this.selectedFilter.set(id);
  }

  onSortChange(id: PublicCatalogSortId): void {
    this.selectedSort.set(id);
  }

  goToPrevPage(): void {
    if (!this.pagination().has_prev) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  goToNextPage(): void {
    if (!this.pagination().has_next) return;
    this.currentPage.update((p) => p + 1);
  }

  constructor() {
    effect(() => {
      this.selectedFilter();
      this.searchText();
      this.currentPage.set(1);
    });
  }

  private emptyResponse(limit: number, offset: number): PublicBooksApiResponse {
    return {
      data: [],
      total: 0,
      pagination: {
        limit,
        offset,
        count: 0,
        total: 0,
        current_page: Math.floor(offset / limit) + 1,
        total_pages: 0,
        has_next: false,
        has_prev: offset > 0,
      },
    };
  }

  private mapAvailability(status: string): PublicCatalogAvailability {
    return status === 'available' ? 'available' : 'checked_out';
  }
}
