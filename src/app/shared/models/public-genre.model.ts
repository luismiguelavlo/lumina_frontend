export interface PublicGenre {
  readonly id: string;
  readonly name: string;
}

export interface PublicGenresApiResponse {
  readonly data?: readonly unknown[];
}

export type PublicGenresApiPayload = PublicGenresApiResponse | readonly unknown[];
