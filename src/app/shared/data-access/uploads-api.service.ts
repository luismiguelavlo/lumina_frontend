import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { UploadApiResponse, UploadFolder } from '../models/uploads-api.model';

@Injectable({ providedIn: 'root' })
export class UploadsApiService {
  private readonly http = inject(HttpClient);
  private readonly uploadsUrl = `${environment.apiBaseUrl}/api/uploads`;

  uploadImage(file: File, folder: UploadFolder): Observable<UploadApiResponse> {
    const form = new FormData();
    form.append('file', file, file.name);
    form.append('folder', folder);
    return this.http.post<UploadApiResponse>(this.uploadsUrl, form).pipe(
      catchError((error: unknown) => {
        const message = this.toMessage(error);
        return throwError(() => new Error(message));
      }),
    );
  }

  private toMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'No fue posible subir la imagen.';
    }
    const backendMessage =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? (error.error as { message?: unknown }).message
        : null;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      return backendMessage;
    }
    if (error.status === 503) {
      return 'Subida de imágenes no configurada en el servidor.';
    }
    if (error.status === 0) {
      return 'No fue posible conectar con el servidor.';
    }
    return 'No fue posible subir la imagen.';
  }
}
