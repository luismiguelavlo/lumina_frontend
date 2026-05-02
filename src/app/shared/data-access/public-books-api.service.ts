import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CreateBookRequest,
  PublicBookDetailApiResponse,
  PublicBookPatchBody,
  PublicBooksApiResponse,
  PublicBooksQuery,
} from '../models/public-books-api.model';

export type PublicBooksApiErrorCode = 'not_found' | 'network_error' | 'server_error' | 'unexpected_error';

export class PublicBooksApiError extends Error {
  constructor(
    readonly code: PublicBooksApiErrorCode,
    message: string,
    readonly sourceError?: unknown,
  ) {
    super(message);
    this.name = 'PublicBooksApiError';
  }
}

@Injectable({ providedIn: 'root' })
export class PublicBooksApiService {
  private readonly http = inject(HttpClient);
  private readonly booksUrl = `${environment.apiBaseUrl}/api/books`;

  createBook(body: CreateBookRequest): Observable<PublicBookDetailApiResponse> {
    return this.http.post<PublicBookDetailApiResponse>(this.booksUrl, body);
  }

  listBooks(query: PublicBooksQuery): Observable<PublicBooksApiResponse> {
    let params = new HttpParams()
      .set('limit', String(query.limit))
      .set('offset', String(query.offset));

    if (query.search && query.search.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.genreId && query.genreId !== 'all') {
      params = params.set('genre_id', query.genreId);
    }

    return this.http.get<PublicBooksApiResponse>(this.booksUrl, { params });
  }

  getBookById(bookId: string): Observable<PublicBookDetailApiResponse> {
    return this.http.get<PublicBookDetailApiResponse>(`${this.booksUrl}/${bookId}`).pipe(
      catchError((error: unknown) => this.mapDetailHttpError(error, 'consultar')),
    );
  }

  updateBook(bookId: string, body: PublicBookPatchBody): Observable<PublicBookDetailApiResponse> {
    return this.http
      .put<PublicBookDetailApiResponse>(`${this.booksUrl}/${bookId}`, body)
      .pipe(catchError((error: unknown) => this.mapDetailHttpError(error, 'actualizar')));
  }

  private mapDetailHttpError(error: unknown, verb: 'consultar' | 'actualizar') {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(
        () => new PublicBooksApiError('unexpected_error', `No fue posible ${verb} el libro.`, error),
      );
    }

    const message = this.extractBackendMessage(error);

    if (error.status === 404 || message === 'Libro no encontrado') {
      return throwError(
        () => new PublicBooksApiError('not_found', message ?? 'Libro no encontrado', error),
      );
    }

    if (error.status === 0) {
      return throwError(
        () =>
          new PublicBooksApiError(
            'network_error',
            `No fue posible conectar con el servidor para ${verb} el libro.`,
            error,
          ),
      );
    }

    if (error.status >= 500) {
      return throwError(
        () =>
          new PublicBooksApiError(
            'server_error',
            `El servidor presento un problema al ${verb} el libro.`,
            error,
          ),
      );
    }

    return throwError(
      () =>
        new PublicBooksApiError(
          'unexpected_error',
          message ?? `No fue posible ${verb} el libro en este momento.`,
          error,
        ),
    );
  }

  private extractBackendMessage(error: HttpErrorResponse): string | null {
    if (!error.error || typeof error.error !== 'object') {
      return null;
    }
    const message = (error.error as { message?: unknown }).message;
    return typeof message === 'string' ? message : null;
  }
}
