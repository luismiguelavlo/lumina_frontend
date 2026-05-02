import type { PublicCatalogBookDetail } from '../../../shared/models/public-catalog.models';

const DETAILS: Record<string, PublicCatalogBookDetail> = {
  'great-gatsby': {
    bookId: 'great-gatsby',
    breadcrumbCategory: 'American literature',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLFgRgZWkMGMYflqaVNxY7X6I2aaupTrEoLs07tYsnR8sXmNtIr9X8owyQ1kQVkfC2hIkGhRLYH35abPnldLMIBjHfXeW6I3XGU3xu52ah4fnVkEseHMaM8pB6mH9_ZIgtGtai0yF5832JvHUEP4o3P6l2KWiXTpczEGxmNeJyLryz3qTxP3GcBOPvj8Q__j9HNgVYNyE2LHGNROvV9dwFmhKjhlyTBZEHutUIJEstIGB_sI7bIrDCqh18tCMtYukScOQ3cW7YdS8',
    coverAlt: 'Book cover for The Great Gatsby',
    availability: 'available',
    secondaryBadgeLabel: 'Fiction',
    synopsis:
      'A portrait of the Jazz Age in all its decadence and excess, Gatsby captures the restless spirit of 1920s America through the eyes of Nick Carraway and his mysterious neighbor Jay Gatsby—whose pursuit of an impossible dream ends in tragedy.',
    publishedYear: '1925',
    pageCount: '180',
  },
  dune: {
    bookId: 'dune',
    breadcrumbCategory: 'Science fiction',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsNGnrFqjsQCUx6yterro7qZtHBDtE2f7osfv7oY0l3ntX4ABXo7G5eDd7-97OxNc5gG0Lqskp2eL6I_Ho1IBSSqFhR_zUvEss9JR7MIBF389M-q6DDX0Rn0aAl7IY9xq5QLAMQ7AjufDK-2xCSBjl8yP4ttpKLndZKtqqYGTQhGK0KucYe31duQoLxT3SxAQjI5xgZnRm55fAJJFOo1sNNypzW8Paaogk4RGZN-BPh5YIFl9Jp1SHvPJzRGfzThM2PtUIsKELs0',
    coverAlt: 'Book cover for Dune',
    availability: 'checked_out',
    secondaryBadgeLabel: 'Epic',
    synopsis:
      'Set on the desert planet Arrakis, Dune is the story of Paul Atreides—heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange. A stunning blend of adventure, mysticism, environmentalism, and politics.',
    publishedYear: '1965',
    pageCount: '688',
  },
  republic: {
    bookId: 'republic',
    breadcrumbCategory: 'Philosophy',
    title: 'The Republic',
    author: 'Plato',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAmnUy8SgWlsdOonZn8vDS_0k8e__LnIcQ_JYb7fombAoTWQDcD32P2peLt-ocqkOV_ZDsNMLQ7sQCM1wXsZQet8CRG_zvnOXjhfa_h8bciaA66FJC1mFIFNnDXHDIB0WrCmUB7wd35uwKF7IWwZkMfL3AcfMKl2jbUrKOEQwU-5QL_yg2_ztnRTzF8J9BvhJf6qxFyU8b6AatN5ivxlgQ18ps0xIq8mWC3eddRizgXVXiyN8nLQ9Gr-lu3fSEhOYRddz_rv5jeY4',
    coverAlt: 'Book cover for The Republic',
    availability: 'available',
    secondaryBadgeLabel: 'Reference',
    synopsis:
      'Plato’s foundational dialogue on justice, the ideal state, and the nature of reality—framed as a conversation in which Socrates examines what makes a society virtuous and how education shapes the soul.',
    publishedYear: 'c. 380 BCE',
    pageCount: '416',
  },
  sapiens: {
    bookId: 'sapiens',
    breadcrumbCategory: 'World history',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDd3uZXvWg0cH69J8lLOzU39TtlENiqvZu7mxzDQGuMltixqPcfSOVs0dQUyHbesUeH5N23WCIAaQaeymGI1xO6GxXwUnP8w8VjKTlzFQrb0xD9NUxhXQIFSaVTD8x10vFGDcYdg-idMb1aPvTCZ_kvo43J6Mthja7eVYhCod8HDfW77LAhn2YfnbDYqBh59Uy8r7e11lskCXVX4JAYaY0wCfhIVJaaSmmVd4HEzrGN4HMCnmxgZJwTAmu8vdejLrJZdp94Axti9k',
    coverAlt: 'Book cover for Sapiens',
    availability: 'available',
    secondaryBadgeLabel: 'Non-fiction',
    synopsis:
      'Harari surveys the entire history of humankind, from the evolution of Homo sapiens in the Stone Age to the political and technological upheavals of the twenty-first century—asking how we came to dominate the planet and what it means for our future.',
    publishedYear: '2011',
    pageCount: '443',
  },
  '1984': {
    bookId: '1984',
    breadcrumbCategory: 'Dystopian fiction',
    title: '1984',
    author: 'George Orwell',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHBHJ0Rno_OncFDDPY2BLYADUNh-jgt30Y65zX7C0xF5B6Y08GmKmkHZ2v_5n-2WnbiMh7VHfYIvkM0GOGKJBpXr0Cgr1Mjr7BEsvnE4K0Ew0eBYtPoFgi6fHkKApvGCUWcKiyeSEfB8wL7z3HfWFN9r1vPYpwN_G0VBTNHPfE-CEM4K0gO8A_jcYW7tE0Ta5Il9tzT6BZFetYO7brHwIYsNfo8vs63WBMS2TtCAaIOeuyKltlSAy8rOZ31TZrkWzt91YOt9hUxp0',
    coverAlt: 'Book cover for 1984',
    availability: 'available',
    secondaryBadgeLabel: 'Fiction',
    synopsis:
      'Winston Smith lives under the totalitarian Party and its omnipresent surveillance. A chilling exploration of truth, language, and power that remains one of the most influential novels of the twentieth century.',
    publishedYear: '1949',
    pageCount: '328',
  },
};

export function getPublicBookDetail(bookId: string): PublicCatalogBookDetail | undefined {
  return DETAILS[bookId];
}
