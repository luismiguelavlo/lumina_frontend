import type { PublicCatalogBook } from '../../../shared/models/public-catalog.models';

export const PUBLIC_CATALOG_DEMO_BOOKS: readonly PublicCatalogBook[] = [
  {
    id: 'great-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    categoryLabel: 'Classic',
    categoryTextClass: 'text-primary',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLFgRgZWkMGMYflqaVNxY7X6I2aaupTrEoLs07tYsnR8sXmNtIr9X8owyQ1kQVkfC2hIkGhRLYH35abPnldLMIBjHfXeW6I3XGU3xu52ah4fnVkEseHMaM8pB6mH9_ZIgtGtai0yF5832JvHUEP4o3P6l2KWiXTpczEGxmNeJyLryz3qTxP3GcBOPvj8Q__j9HNgVYNyE2LHGNROvV9dwFmhKjhlyTBZEHutUIJEstIGB_sI7bIrDCqh18tCMtYukScOQ3cW7YdS8',
    coverAlt: 'Book cover for The Great Gatsby',
    availability: 'available',
    isClassic: true,
    addedAt: 1_704_000_000_000,
  },
  {
    id: 'dune',
    title: 'Dune',
    author: 'Frank Herbert',
    categoryLabel: 'Sci-Fi',
    categoryTextClass: 'text-[#00677d]',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWsNGnrFqjsQCUx6yterro7qZtHBDtE2f7osfv7oY0l3ntX4ABXo7G5eDd7-97OxNc5gG0Lqskp2eL6I_Ho1IBSSqFhR_zUvEss9JR7MIBF389M-q6DDX0Rn0aAl7IY9xq5QLAMQ7AjufDK-2xCSBjl8yP4ttpKLndZKtqqYGTQhGK0KucYe31duQoLxT3SxAQjI5xgZnRm55fAJJFOo1sNNypzW8Paaogk4RGZN-BPh5YIFl9Jp1SHvPJzRGfzThM2PtUIsKELs0',
    coverAlt: 'Book cover for Dune',
    availability: 'checked_out',
    showBookmark: true,
    addedAt: 1_702_000_000_000,
  },
  {
    id: 'republic',
    title: 'The Republic',
    author: 'Plato',
    categoryLabel: 'Academic',
    categoryTextClass: 'text-[#847463]',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAmnUy8SgWlsdOonZn8vDS_0k8e__LnIcQ_JYb7fombAoTWQDcD32P2peLt-ocqkOV_ZDsNMLQ7sQCM1wXsZQet8CRG_zvnOXjhfa_h8bciaA66FJC1mFIFNnDXHDIB0WrCmUB7wd35uwKF7IWwZkMfL3AcfMKl2jbUrKOEQwU-5QL_yg2_ztnRTzF8J9BvhJf6qxFyU8b6AatN5ivxlgQ18ps0xIq8mWC3eddRizgXVXiyN8nLQ9Gr-lu3fSEhOYRddz_rv5jeY4',
    coverAlt: 'Book cover for The Republic',
    availability: 'available',
    addedAt: 1_698_000_000_000,
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    categoryLabel: 'Non-Fiction',
    categoryTextClass: 'text-[#78582f]',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDd3uZXvWg0cH69J8lLOzU39TtlENiqvZu7mxzDQGuMltixqPcfSOVs0dQUyHbesUeH5N23WCIAaQaeymGI1xO6GxXwUnP8w8VjKTlzFQrb0xD9NUxhXQIFSaVTD8x10vFGDcYdg-idMb1aPvTCZ_kvo43J6Mthja7eVYhCod8HDfW77LAhn2YfnbDYqBh59Uy8r7e11lskCXVX4JAYaY0wCfhIVJaaSmmVd4HEzrGN4HMCnmxgZJwTAmu8vdejLrJZdp94Axti9k',
    coverAlt: 'Book cover for Sapiens',
    availability: 'available',
    isNewArrival: true,
    addedAt: 1_706_000_000_000,
    cardBorderClass: 'border-primary/20',
  },
  {
    id: '1984',
    title: '1984',
    author: 'George Orwell',
    categoryLabel: 'Classic',
    categoryTextClass: 'text-primary',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHBHJ0Rno_OncFDDPY2BLYADUNh-jgt30Y65zX7C0xF5B6Y08GmKmkHZ2v_5n-2WnbiMh7VHfYIvkM0GOGKJBpXr0Cgr1Mjr7BEsvnE4K0Ew0eBYtPoFgi6fHkKApvGCUWcKiyeSEfB8wL7z3HfWFN9r1vPYpwN_G0VBTNHPfE-CEM4K0gO8A_jcYW7tE0Ta5Il9tzT6BZFetYO7brHwIYsNfo8vs63WBMS2TtCAaIOeuyKltlSAy8rOZ31TZrkWzt91YOt9hUxp0',
    coverAlt: 'Book cover for 1984',
    availability: 'available',
    isClassic: true,
    addedAt: 1_695_000_000_000,
  },
];
