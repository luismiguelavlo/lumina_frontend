import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  forkJoin,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicBooksApiService } from '../../../../shared/data-access/public-books-api.service';
import { PublicGenresApiService } from '../../../../shared/data-access/public-genres-api.service';
import { AuthorsApiService } from '../../../../shared/data-access/authors-api.service';
import type { CatalogBook } from '../../../../shared/models/catalog-book.model';
import type {
  CreateBookRequest,
  PublicBooksApiResponse,
  PublicBooksPagination,
} from '../../../../shared/models/public-books-api.model';
import type { PublicGenre } from '../../../../shared/models/public-genre.model';
import type { AuthorListItem, CreateAuthorRequest } from '../../../../shared/models/authors-api.model';
import type { LumCatalogCreateTab } from '../../../../shared/ui/organisms/lum-catalog-create-modal/lum-catalog-create-tab';
import type { LumMultiSearchPickOption } from '../../../../shared/ui/molecules/lum-neo-multi-search-pick/lum-neo-multi-search-pick.component';

const PAGE_SIZE = 20;
const COVER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80';

const CURRENT_YEAR = new Date().getFullYear();

@Injectable()
export class AdminBooksCatalogStore {
  private readonly booksApi = inject(PublicBooksApiService);
  private readonly genresApi = inject(PublicGenresApiService);
  private readonly authorsApi = inject(AuthorsApiService);
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly currentPage = signal(1);
  private readonly isLoadingState = signal(false);
  private readonly catalogRefreshNonce = signal(0);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly selectedGenreId = signal<string>('all');

  readonly isCreateModalOpen = signal(false);
  readonly createModalTab = signal<LumCatalogCreateTab>('book');
  readonly isCreatingAuthor = signal(false);
  readonly isCreatingBook = signal(false);
  readonly isLoadingCatalogPicklists = signal(false);
  readonly authorCreateError = signal<string | null>(null);
  readonly bookCreateError = signal<string | null>(null);
  readonly authorCreateSuccess = signal<string | null>(null);
  readonly bookCreateSuccess = signal<string | null>(null);

  readonly authorPickOptions = signal<readonly LumMultiSearchPickOption[]>([]);
  readonly genrePickOptions = signal<readonly LumMultiSearchPickOption[]>([]);

  readonly authorForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    bio: [''],
  });

  readonly bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    isbn: ['', [Validators.required]],
    catalog_code: ['', [Validators.required]],
    synopsis: [''],
    publication_year: [
      CURRENT_YEAR,
      [Validators.required, Validators.min(1000), Validators.max(CURRENT_YEAR + 1)],
    ],
    pages: [1, [Validators.required, Validators.min(1)]],
    cover_url: [''],
    location: ['', [Validators.required]],
    total_copies: [1, [Validators.required, Validators.min(1)]],
    author_ids: new FormControl<string[]>([], { nonNullable: true }),
    genre_ids: new FormControl<string[]>([], { nonNullable: true }),
  });

  readonly isCreateModalBusy = computed(
    () => this.isCreatingAuthor() || this.isCreatingBook() || this.isLoadingCatalogPicklists(),
  );

  private readonly searchText = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  readonly genres = toSignal(
    this.genresApi.getGenres().pipe(catchError(() => of([] as readonly PublicGenre[]))),
    { initialValue: [] as readonly PublicGenre[] },
  );

  readonly genreFilterOptions = computed(() => {
    const all = { id: 'all', name: 'All' };
    return [all, ...this.genres()];
  });

  private readonly query = computed(() => ({
    limit: PAGE_SIZE,
    offset: (this.currentPage() - 1) * PAGE_SIZE,
    search: (this.searchText() ?? '').trim(),
    genreId: this.selectedGenreId() === 'all' ? undefined : this.selectedGenreId(),
    refreshNonce: this.catalogRefreshNonce(),
  }));

  private readonly booksResponse = toSignal(
    toObservable(this.query).pipe(
      switchMap((q) => {
        this.isLoadingState.set(true);
        return this.booksApi.listBooks(q).pipe(
          catchError(() => of(this.emptyResponse(q.limit, q.offset))),
          finalize(() => this.isLoadingState.set(false)),
        );
      }),
    ),
    { initialValue: this.emptyResponse(PAGE_SIZE, 0) },
  );

  readonly books = computed<readonly CatalogBook[]>(() =>
    (this.booksResponse().data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      sku: row.isbn ?? row.id,
      coverUrl: row.cover_url || COVER_PLACEHOLDER,
      coverAlt: `Book cover for ${row.title}`,
      availability: row.status === 'available' ? 'available' : 'borrowed',
    })),
  );

  readonly pagination = computed<PublicBooksPagination>(() => this.booksResponse().pagination);
  readonly isLoading = computed(() => this.isLoadingState());

  onGenreSelect(id: string): void {
    this.selectedGenreId.set(id);
  }

  goToPrevPage(): void {
    if (!this.pagination().has_prev) return;
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  goToNextPage(): void {
    if (!this.pagination().has_next) return;
    this.currentPage.update((p) => p + 1);
  }

  openCreateModal(): void {
    this.authorCreateError.set(null);
    this.bookCreateError.set(null);
    this.authorForm.reset({ name: '', bio: '' });
    this.resetBookForm();
    this.createModalTab.set('book');
    this.isCreateModalOpen.set(true);
    this.loadCatalogPicklists();
  }

  closeCreateModal(): void {
    if (this.isCreateModalBusy()) return;
    this.isCreateModalOpen.set(false);
    this.authorCreateError.set(null);
    this.bookCreateError.set(null);
  }

  setCreateModalTab(tab: LumCatalogCreateTab): void {
    if (this.isCreateModalBusy()) return;
    this.createModalTab.set(tab);
    if (tab === 'author') {
      this.bookCreateError.set(null);
    } else {
      this.authorCreateError.set(null);
    }
  }

  dismissAuthorSuccess(): void {
    this.authorCreateSuccess.set(null);
  }

  dismissBookSuccess(): void {
    this.bookCreateSuccess.set(null);
  }

  submitCreateAuthor(): void {
    if (this.isCreatingAuthor()) return;
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      this.authorCreateError.set('Please enter a valid author name (at least 2 characters).');
      return;
    }

    const v = this.authorForm.getRawValue();
    const payload: CreateAuthorRequest = {
      name: v.name.trim(),
      ...(v.bio.trim() ? { bio: v.bio.trim() } : {}),
    };

    this.isCreatingAuthor.set(true);
    this.authorCreateError.set(null);

    this.authorsApi
      .createAuthor(payload)
      .pipe(
        take(1),
        finalize(() => this.isCreatingAuthor.set(false)),
      )
      .subscribe({
        next: (created) => {
          const label = created.name?.trim() || payload.name;
          this.isCreateModalOpen.set(false);
          this.authorCreateSuccess.set(`Author "${label}" was created successfully.`);
        },
        error: (error: unknown) => {
          this.authorCreateError.set(this.toAuthorCreateErrorMessage(error));
        },
      });
  }

  submitCreateBook(): void {
    if (this.isCreatingBook()) return;
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.bookCreateError.set('Please complete all required fields with valid values.');
      return;
    }

    const v = this.bookForm.getRawValue();
    const payload: CreateBookRequest = {
      title: v.title.trim(),
      isbn: v.isbn.trim(),
      catalog_code: v.catalog_code.trim(),
      publication_year: Math.trunc(Number(v.publication_year)),
      pages: Math.trunc(Number(v.pages)),
      total_copies: Math.trunc(Number(v.total_copies)),
      author_ids: [...v.author_ids],
      genre_ids: [...v.genre_ids],
      ...(v.synopsis.trim() ? { synopsis: v.synopsis.trim() } : {}),
      ...(v.cover_url.trim() ? { cover_url: v.cover_url.trim() } : {}),
      ...(v.location.trim() ? { location: v.location.trim() } : {}),
    };

    this.isCreatingBook.set(true);
    this.bookCreateError.set(null);

    this.booksApi
      .createBook(payload)
      .pipe(
        take(1),
        finalize(() => this.isCreatingBook.set(false)),
      )
      .subscribe({
        next: (created) => {
          const titleLabel = created.title?.trim() || payload.title;
          this.isCreateModalOpen.set(false);
          this.bookCreateSuccess.set(`Book "${titleLabel}" was created successfully.`);
          this.catalogRefreshNonce.update((n) => n + 1);
        },
        error: (error: unknown) => {
          this.bookCreateError.set(this.toBookCreateErrorMessage(error));
        },
      });
  }

  constructor() {
    effect(() => {
      this.selectedGenreId();
      this.searchText();
      this.currentPage.set(1);
    });
  }

  private loadCatalogPicklists(): void {
    this.isLoadingCatalogPicklists.set(true);
    forkJoin({
      authors: this.authorsApi.listAuthors().pipe(
        catchError(() => of([] as readonly AuthorListItem[])),
      ),
      genres: this.genresApi.getGenres().pipe(catchError(() => of([] as readonly PublicGenre[]))),
    })
      .pipe(
        take(1),
        finalize(() => this.isLoadingCatalogPicklists.set(false)),
      )
      .subscribe(({ authors, genres }) => {
        this.authorPickOptions.set(
          authors.map((a) => ({
            id: a.id,
            label: a.name,
          })),
        );
        this.genrePickOptions.set(
          genres.map((g) => ({
            id: g.id,
            label: g.name,
          })),
        );
      });
  }

  private resetBookForm(): void {
    this.bookForm.reset({
      title: '',
      isbn: '',
      catalog_code: '',
      synopsis: '',
      publication_year: CURRENT_YEAR,
      pages: 1,
      cover_url: '',
      location: '',
      total_copies: 1,
      author_ids: [],
      genre_ids: [],
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

  private toAuthorCreateErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Could not create the author. Please try again.';
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return 'Could not connect to the server.';
    }

    return 'Could not create the author. Please try again.';
  }

  private toBookCreateErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Could not create the book. Please try again.';
    }

    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;

    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.status === 0) {
      return 'Could not connect to the server.';
    }

    return 'Could not create the book. Please try again.';
  }
}
