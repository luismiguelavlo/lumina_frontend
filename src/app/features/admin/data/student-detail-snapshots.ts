import type { StudentProfileDetail } from '../../../shared/models/student-profile.model';

const sharedLoans = (): StudentProfileDetail['loans'] => [
  {
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxVYdwstfibT_GgmzI37uPfCMouDTZS24DCuJditYq7AVtuDhkp65Mq_zPQI--kGMWflAr1SAriuqRzeXzyXpOv2VBslz-RknRuTT2X8qqdHCBThlo3Y6NzLkzuLz9t8Ho_xSktwt3SWIvWXTOrSCzlFLjBr7oW_SAVPZ4KqcysWcoaREKEy-dh0PKtuiJ8-jEMc3GPeEaG4Z-OuLHuwyahDlkFZapa8GTBD91KTGcAoFvTvT7pFOJbnmC8H71fsqMKFlkam3PpM',
    coverAlt: 'Book cover Design Patterns',
    segmentLabel: 'Currently Reading',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    authors: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    statusLabel: 'Active',
    tone: 'active',
    primaryDateLabel: 'Borrowed: Oct 12, 2023',
    dueDateLabel: 'Due: Oct 26, 2023',
    timelineDotActive: true,
  },
  {
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_o2aY_HR0vMoG1gjFelGtcjCJYSWa46nIU3S1dg_4TuOzgkVSfGWOZDQPeVndvv0DSj80bwgqR75jEAVRtMFp05wughGEB9gLXgA7oUGE9Bjhvi8wSIK-0laDWEIa470jerzIRtjppcGY8db1Dn7X0v4iO2qFhl4bdAVVZv6vDi12CKUC6mprU7qx0FcAXclST2YR7bmj81wiATNhpIuN-tRMj_i8GF5ce4XBytB6sHDIcl2YcAnMn1mLALgNyv4hOfyIn2EhSw',
    coverAlt: 'Book cover Clean Code',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: 'Robert C. Martin',
    statusLabel: 'Returned',
    tone: 'returned',
    primaryDateLabel: '',
    dateRangeLabel: 'Sep 15 - Sep 28, 2023',
    ratingOutOf5: 4,
    timelineDotActive: false,
  },
  {
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_YziAMLGbVIl3ru_B2Dm7XLOH6X4oY_iGDEEqxpKUI4_I_V8w8oNpl_QkYDePFU3nx2EcvZGYNK0fcaAjc-qOIfnQXrspzDePP69_niht3hFUYunNQRzUuJoK1HM6FXDc7Bmgx9hqwnAvWSvxlOQCAgxKJLHgh2TsCBdV6hHgTjGPam2bm4JT5j_7jjnxHKGIzC98Uaqfez1Hg3mEDhA2YlJS2hkX3Gf72O0paKEpMzU0UHGdUzpKCG67hJ8Ibmwx5QX9xEqxrAo',
    coverAlt: 'Book cover The Pragmatic Programmer',
    title: 'The Pragmatic Programmer',
    authors: 'David Thomas, Andrew Hunt',
    statusLabel: 'Returned',
    tone: 'returned',
    primaryDateLabel: '',
    dateRangeLabel: 'Aug 10 - Aug 24, 2023',
    ratingOutOf5: 5,
    timelineDotActive: false,
  },
];

const defaultBadges = (): StudentProfileDetail['badges'] => [
  { icon: 'schedule', label: 'Punctual Reader', locked: false },
  { icon: 'import_contacts', label: 'Bookworm', locked: false },
  { icon: 'category', label: 'Explorer', locked: false },
  { icon: 'lock', label: 'Night Owl', locked: true },
  { icon: 'lock', label: 'Reviewer', locked: true },
  { icon: 'lock', label: 'Collector', locked: true },
];

const defaultStats = (): StudentProfileDetail['stats'] => [
  { label: 'Total Read', value: '142', icon: 'menu_book', accent: 'primary' },
  { label: 'Active', value: '3', icon: 'bookmark', accent: 'primary' },
  { label: 'Overdue', value: '0', icon: 'warning', accent: 'danger' },
  { label: 'Streak', value: '14', icon: 'local_fire_department', accent: 'primary', valueSuffix: 'd' },
];

const snapshots: Record<string, StudentProfileDetail> = {
  'LIB-8492': {
    patronId: 'LIB-8492',
    name: 'Alice Johnson',
    subtitle: 'Undergraduate Student — Library Science',
    memberSinceLabel: 'Member since Sept 2021',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA66XOXiTqdob_f6s68d1obepSzwVPeAiRQw1mvtVGKpV4IkvQt5p7BgAv9e4IdNZNdWAvCV4ppsfswfZUzw3O-llockTGAjm5sER78yA6s7uHjVza1GTC0miubE1EMleR477VTsFeOUD3WKvSuBdRzPRQu5pIn1Qktyk0K0QiddrGne_jNCLQ6pJS002S_WhCEShE87k17vCwU7BBc9SRo5x_5XJQWj7_1AsFKnUrEOZVegzc6KT4nbDcfFbJLYZ2wqeSB0xAOi94',
    avatarAlt: 'Avatar of Alice Johnson',
    verified: true,
    stats: defaultStats(),
    badges: defaultBadges(),
    badgeUnlocked: 8,
    badgeTotal: 12,
    loans: sharedLoans(),
  },
  'LIB-1024': {
    patronId: 'LIB-1024',
    name: 'Bob Smith',
    subtitle: 'Graduate Student — History',
    memberSinceLabel: 'Member since Jan 2022',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCU9HkwE7Hgr_Y9yCxH1ZrpAuRq62H3Axy0TRhFaoCsHWmoNvBFMHot20LD2uqOScCaolMXJN9xRvCgP1tS2V9X7IrQuFrx6Sj9SysZHwY4q8OyuXHnv2ovsuxDDe9ZnLERfFK96b0vA1Ee9A18FgqaIHdiUIbB5nIYZo4Cz-TSQVTo9ZPGgvrOk7dU6IKfoYumjfybIIgIqm24MVbKw5KcUmZZy7hxF-I1G8oa-_K3Z9Ds8NNaAHeVpP4mvJHY_d2ybDyDoTOvfHo',
    avatarAlt: 'Avatar of Bob Smith',
    verified: true,
    stats: defaultStats(),
    badges: defaultBadges(),
    badgeUnlocked: 5,
    badgeTotal: 12,
    loans: sharedLoans(),
  },
  'LIB-5531': {
    patronId: 'LIB-5531',
    name: 'Charlie Davis',
    subtitle: 'Undergraduate Student — Engineering',
    memberSinceLabel: 'Member since Mar 2020',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC08dowDZQBnTbWqsLqArnLPTL6b4lOEjI5UyWVZjLBXA-D-_H8iKi2o9gOSboi6EvihHc5vg9pMVzYpYn60JwIutWqAweckxW_Qg5jGmv53EyFB6a_YGPDjeBMxVGOyFHeHNsmrH4f-UFRUeQdGbmA6_Pu2yFXtTWMjCsp_9AY8GdpOEakB-H3uljaD0GsRfeN3pDJx9Ym9wDGeKC0RLvkeyMQp64W_rKsl4E80AClC7DvrfEbcmTr8hgzxF4uTUwEwIu7UvSJNx0',
    avatarAlt: 'Avatar of Charlie Davis',
    verified: false,
    stats: defaultStats(),
    badges: defaultBadges(),
    badgeUnlocked: 6,
    badgeTotal: 12,
    loans: sharedLoans(),
  },
  'LIB-9920': {
    patronId: 'LIB-9920',
    name: 'Diana Prince',
    subtitle: 'Faculty — Classical Studies',
    memberSinceLabel: 'Member since Aug 2019',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4GJVCE_jaSDdhYtF3Uwr8IXA99jr3EBnu_i2liINH4v-m7cUaGfpyC8hYPXA61R7M9rnd2JmUxrPAIh2_XtKn5yw0HF6Wgm8FODOhLX8Lq7VblEFLV2qjf6no1s0tHG7Wi62PtAjlaP-X2S5d1D06rkHrsyyG76-tpuJ9NUwEdbvPKYSomnkRbZ27M_6LlLO3_QMUKd4zIrFySlfz3K5N2ktRUujqYOK7YVuKFU6U4tfWxwjq-lhvJRWr4EDbxJ33XJNWO5VkZ7w',
    avatarAlt: 'Avatar of Diana Prince',
    verified: true,
    stats: defaultStats(),
    badges: defaultBadges(),
    badgeUnlocked: 10,
    badgeTotal: 12,
    loans: sharedLoans(),
  },
};

const fallbackDetail = (patronId: string): StudentProfileDetail => ({
  patronId,
  name: 'Library patron',
  subtitle: 'Student profile',
  memberSinceLabel: 'Member since —',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD8YlJEubrxhGjPqShMw9tz50k_3pvXPKr5f5-t8RwKZu_XmrzHVrsP-jxcv2fU5b4YtJ-jA0BSbz7qraF9aOyOo4UkoFJWNqU0YxR5NgaplnZN1ICvUFvBWOBYBaev1IQZPGs2qDOV5nTNiWtV0TPJujFH3_ie9fKOz73lxLvNBRJFwqAGZfFeCB_PbEfbheZHhPVb5K0NkkZR_0uUS_yVkjMVm4c7cSGqnq18c_eLRepmGdlj-uy30Wcp_WOARYOf0fbPC60yDeE',
  avatarAlt: 'Profile picture',
  verified: true,
  stats: defaultStats(),
  badges: defaultBadges(),
  badgeUnlocked: 8,
  badgeTotal: 12,
  loans: sharedLoans(),
});

export function getStudentProfileDetail(patronId: string | null): StudentProfileDetail {
  if (!patronId) {
    return fallbackDetail('—');
  }
  return snapshots[patronId] ?? fallbackDetail(patronId);
}
