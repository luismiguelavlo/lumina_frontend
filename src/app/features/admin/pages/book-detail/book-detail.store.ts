import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, of, switchMap, take } from 'rxjs';
import { PublicBooksApiError, PublicBooksApiService } from '../../../../shared/data-access/public-books-api.service';
import { PublicGenresApiService } from '../../../../shared/data-access/public-genres-api.service';
import type { CatalogAvailability } from '../../../../shared/models/catalog-book.model';
import type {
  PublicBookDetailApiResponse,
  PublicBookPatchBody,
} from '../../../../shared/models/public-books-api.model';
import type { LumSelectOption } from '../../../../shared/ui/molecules/lum-neo-select-field/lum-neo-select-field.component';

const COVER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80';

interface BookDetailState {
  status: 'empty' | 'loading' | 'ok' | 'not_found' | 'error';
  message?: string;
}

@Injectable()
export class AdminBookDetailStore {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly booksApi = inject(PublicBooksApiService);
  private readonly genresApi = inject(PublicGenresApiService);
  private readonly fb = inject(NonNullableFormBuilder);

  /** Last successful GET/PUT payload; used for fields not editable in the form (e.g. total_copies, status). */
  private lastDetail: PublicBookDetailApiResponse | null = null;

  readonly form = this.fb.group({
    title: [''],
    author: [''],
    isbn: [''],
    publicationYear: [new Date().getFullYear()],
    pages: [0],
    synopsis: [''],
    genre: [''],
    locationShelf: [''],
  });

  readonly titlePreview = signal('');
  readonly coverUrl = signal(COVER_PLACEHOLDER);
  readonly coverAlt = signal('Book cover');
  readonly availability = signal<CatalogAvailability>('available');
  readonly totalCopies = signal(0);
  readonly checkedOut = signal(0);
  readonly libraryId = signal('');
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly saveSuccess = signal<string | null>(null);
  readonly isSaving = signal(false);

  readonly genreOptions = toSignal(
    this.genresApi.getGenres().pipe(
      map((genres): readonly LumSelectOption[] =>
        genres.map((g) => ({ value: g.id, label: g.name })),
      ),
      catchError(() => of([] as readonly LumSelectOption[])),
    ),
    { initialValue: [] as readonly LumSelectOption[] },
  );

  private readonly bookId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('bookId') ?? '')),
    { initialValue: '' },
  );

  private readonly fetchState = toSignal(
    toObservable(this.bookId).pipe(
      switchMap((id) => {
        this.lastDetail = null;
        if (!id) return of<BookDetailState>({ status: 'empty' });
        return this.booksApi.getBookById(id).pipe(
          map((response) => {
            this.applyApiData(response);
            return { status: 'ok' as const };
          }),
          catchError((error: unknown) => {
            if (error instanceof PublicBooksApiError && error.code === 'not_found') {
              return of<BookDetailState>({ status: 'not_found' });
            }
            return of<BookDetailState>({
              status: 'error',
              message: 'No fue posible cargar los datos del libro.',
            });
          }),
        );
      }),
    ),
    { initialValue: { status: 'empty' as const } },
  );

  readonly isLoading = computed(() => {
    const s = this.fetchState();
    return !s || s.status === 'loading' || s.status === 'empty';
  });

  constructor() {
    this.form.controls.title.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => {
        this.titlePreview.set(v);
        this.saveSuccess.set(null);
      });

    toObservable(this.fetchState)
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        if (!state) return;
        if (state.status === 'not_found') {
          void this.router.navigate(['/admin/books']);
        }
        if (state.status === 'error') {
          this.loadError.set(state.message ?? 'Error desconocido.');
        }
      });
  }

  onSave(): void {
    const id = this.bookId();
    const base = this.lastDetail;
    if (!id || !base || this.form.invalid || this.isSaving()) {
      return;
    }

    this.saveError.set(null);
    this.saveSuccess.set(null);
    this.isSaving.set(true);

    const v = this.form.getRawValue();
    const publicationYear = this.toInt(v.publicationYear, new Date().getFullYear());
    const pages = this.toInt(v.pages, 0);
    const body: PublicBookPatchBody = {
      title: v.title.trim(),
      isbn: v.isbn.trim() || undefined,
      catalog_code: base.catalog_code?.trim() || undefined,
      synopsis: v.synopsis.trim() || undefined,
      publication_year: publicationYear,
      pages,
      location: v.locationShelf.trim() || undefined,
      total_copies: base.total_copies ?? 0,
      status: base.status ?? 'available',
    };

    this.booksApi
      .updateBook(id, body)
      .pipe(
        take(1),
        finalize(() => this.isSaving.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.applyApiData(response);
          this.form.markAsPristine();
          this.saveError.set(null);
          this.saveSuccess.set('Libro actualizado correctamente.');
        },
        error: (error: unknown) => {
          if (error instanceof PublicBooksApiError && error.code === 'not_found') {
            void this.router.navigate(['/admin/books']);
            return;
          }
          const message =
            error instanceof PublicBooksApiError
              ? error.message
              : 'No fue posible guardar los cambios del libro.';
          this.saveError.set(message);
        },
      });
  }

  onDiscard(): void {
    void this.router.navigate(['/admin/books']);
  }

  onChangeCover(): void {
    // Wire to media picker when available.
  }

  private applyApiData(api: PublicBookDetailApiResponse): void {
    this.lastDetail = api;
    const primaryAuthor = api.authors?.[0]?.name ?? '';
    const primaryGenreId = api.genres?.[0]?.id ?? '';
    const availability: CatalogAvailability = api.status === 'available' ? 'available' : 'borrowed';

    this.form.patchValue({
      title: api.title,
      author: primaryAuthor,
      isbn: api.isbn ?? '',
      publicationYear: api.publication_year ?? new Date().getFullYear(),
      pages: api.pages ?? 0,
      synopsis: api.synopsis ?? '',
      genre: primaryGenreId,
      locationShelf: api.location ?? '',
    });

    this.form.controls.author.disable({ emitEvent: false });
    this.form.controls.genre.disable({ emitEvent: false });

    this.titlePreview.set(api.title);
    this.coverUrl.set(COVER_PLACEHOLDER);
    this.coverAlt.set(`Book cover for ${api.title}`);
    this.availability.set(availability);
    this.totalCopies.set(api.total_copies ?? 0);
    this.checkedOut.set(
      api.total_copies && api.status !== 'available' ? 1 : 0,
    );
    this.libraryId.set(api.catalog_code ?? api.id);
    this.loadError.set(null);
    this.saveError.set(null);
    this.saveSuccess.set(null);
  }

  private toInt(value: unknown, fallback: number): number {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.trunc(numeric);
  }
}
