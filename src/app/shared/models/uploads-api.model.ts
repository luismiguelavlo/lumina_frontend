export type UploadFolder = 'books' | 'students' | 'badges' | 'users';

export interface UploadApiResponse {
  readonly url: string;
  readonly public_id: string;
  readonly folder: string;
  readonly width?: number;
  readonly height?: number;
  readonly format?: string;
  readonly bytes?: number;
}
