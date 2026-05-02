import type { BookDetailSnapshot } from '../../../shared/models/book-detail.model';

const SILENT_ECHO_COVER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEu1aL9zWONwqKIHtsxSMw3rTQWVc2tgvC7BuCbabgfjzAAWK8SRmrzBfDCwpS4cEPWGtkWgW8WOlwvk0ASqUl07nVxf7P7UPtVbzC754TVwOQZSTEIkXgRHvERY5goaQs1fFV3UFnM_wo5hHpyK3wC7JHuYMYv2iMzHCUxoxzgpCqKnmGc7XJOzPqu-nRHZu8irLOWpE8XGe9Y6S0L1qXCm72ldXW4e0F8IGsHzSGg17lbGWMISZ_5xFrhomRGe8FiWyNiN0Oh0g';

const baseDetail = (): BookDetailSnapshot => ({
  libraryId: 'LIB-2023-8942',
  coverUrl: SILENT_ECHO_COVER,
  coverAlt: 'Book cover showing a landscape',
  availability: 'available',
  totalCopies: 5,
  checkedOut: 2,
  title: 'The Silent Echo',
  author: 'Elara Vance',
  isbn: '978-3-16-148410-0',
  publicationYear: 2021,
  pages: 342,
  synopsis:
    'In a world where memories can be extracted and sold, a young archivist discovers a memory that belongs to no one, leading her on a dangerous quest to uncover the truth about her own past.',
  genre: 'Science Fiction',
  locationShelf: 'Section A, Shelf 3, Row 2',
});

const overrides: Readonly<Record<string, Partial<BookDetailSnapshot>>> = {
  'FIC-001': {
    libraryId: 'LIB-2023-1001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    publicationYear: 1925,
    pages: 180,
    genre: 'Mystery',
    synopsis: 'A portrait of the Jazz Age and the American Dream through the eyes of Nick Carraway.',
    locationShelf: 'Section B, Shelf 1, Row 1',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAl7pM-7ULmVattvrSBon0bl_9HMBxFBZoDwJ4HVT_q5z8As-5i6GSSo0Jc7wyOBxdXPKgy8CajAScU44dJRT6nuNgVAfpt2M0qufZmDSgHo8Shdkfjrmu_NSiafgVfGrJ-1brP1t9MrKDTgr5TPkBE_UcLUpcB-LYFR_DdDPggAXwDVqOHJGwAgFDoe6JXxQ9NKKSc2SQQg3eDjAGeQIOhEfzcFZk1AvV-rCLweubLHjIZwoU6wDt_eDxJLoo_h769bY7-B_9Jfgc',
    coverAlt: 'The Great Gatsby book cover',
  },
  'FIC-002': {
    libraryId: 'LIB-2023-1002',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    publicationYear: 1949,
    pages: 328,
    genre: 'Science Fiction',
    synopsis: 'A dystopian social science fiction novel and cautionary tale.',
    locationShelf: 'Section A, Shelf 2, Row 3',
    availability: 'borrowed',
    checkedOut: 3,
    totalCopies: 4,
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfC5429WtlDrUtslcewrxMY-8dgEsDfJUjDgV_hOZ97FnPN0XBxNl09vcCqwGmz-henv1qNgetbAf1UoSM5afbcKRgf1XdfJwhZwDMiSvaiQNbfoj6tfW1mNfimdoNzpwOhwXXnPz8EuWwVF6sUEUMOJeT43uwuSUP_gfWoII8mHrcyKwY9J1wib9HQFWxwx9d25EBTUgbUNyITBA7YaL5SRINGV5hDErhPWm7kleZuqmVdVYcgdiCsLlcV8pxFAlIu-FfQTvFFaM',
    coverAlt: '1984 book cover',
  },
  'FIC-003': {
    libraryId: 'LIB-2023-1003',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    publicationYear: 1960,
    pages: 376,
    genre: 'Mystery',
    synopsis: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    locationShelf: 'Section C, Shelf 4, Row 1',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZNPx9eHpohdh0mZU65O1RrSyOHUgTXWMwHJ4lBvayPWGWkI-tpuy31FfUzvdhOZCGVyJLhWlXn4QV7eB9iZp3KWYLRWnY-Mm0NxkJKbwJROeUqP5OqLMTh0Q5VQBIdH0Fz93UdeVeyQCuNsrSpQEHXUPsRqYNlVeb39RPRP0GFmfU-IItIsE8PYnd5IlqfmF7Et2GmsOZc104PBG9jef8ySgJj4Er4VMixqhB_VGxLxf6c_LfZG-6Aq9EUjObjKYRRNRyVZ6onjg',
    coverAlt: 'To Kill a Mockingbird book cover',
  },
  'SCI-001': {
    libraryId: 'LIB-2023-2001',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0-441-17271-9',
    publicationYear: 1965,
    pages: 688,
    genre: 'Science Fiction',
    synopsis: 'Epic science fiction set on the desert planet Arrakis.',
    locationShelf: 'Section A, Shelf 1, Row 4',
    availability: 'borrowed',
    checkedOut: 1,
    totalCopies: 6,
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0nSi7k6pTk5AGJhOGSKv1GmriGMjSykSAUC3vvu5n16tvKxDsexkUFngnwg_uHdeYFhwRLU29kiAQq_R3vTAhgNyE7wmemHrI1C6iM9Ypng5J2UsmBpptQwc7HEwZ0ZkYJ_dSCdfOxV9yDcIsAZoCsiHieuifEsnswZ9B50sHXlsoEv1FWp_gyMOiFpxDNHopwTkA0vZ_hOT7L8pH1GLkY9LUT8k1aM2Ozw_7vp_0oD8FuW-y8cK4eVr7L0Z9zM95cngin2LiuhE',
    coverAlt: 'Dune book cover',
  },
  'ROM-001': {
    libraryId: 'LIB-2023-3001',
    title: 'Pride & Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    publicationYear: 1813,
    pages: 432,
    genre: 'Romance',
    synopsis: 'A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.',
    locationShelf: 'Section D, Shelf 2, Row 2',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKQw3_afwf-BLDGzGp1QRR9Uaks9wu-h-i7yNIVpDl-YPcncU6jJLa6N2KRwhE1oORFT4lphBypqA9FrBFHUBb_gbOfIfXoesVCagZbkUd4yRmg9oT_RwHP_IpYsjnGfpDkAZD3VEM6Jr_03RzE1fC9XhasqoHZmxqCocnQdC8b1372uQLRqDpk8tpjMatlsf5fB-vMJJMzInPqpba7L1Svu6S3czrYWA7Cr2ZtRcmul2LNImEOXxeGlLIsR1LFeoOFxVFE09R-zE',
    coverAlt: 'Pride and Prejudice book cover',
  },
};

export function getBookDetailSnapshot(bookId: string | null): BookDetailSnapshot {
  const base = baseDetail();
  if (!bookId) {
    return base;
  }
  const patch = overrides[bookId];
  return patch ? { ...base, ...patch } : base;
}
