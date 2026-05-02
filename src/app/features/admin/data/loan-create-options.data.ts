import type { LoanCreateBookOption, LoanCreateStudentOption } from '../../../shared/models/loan-create.models';

export const LOAN_CREATE_STUDENTS: readonly LoanCreateStudentOption[] = [
  {
    id: '2023-08492',
    name: 'Carlos Mendoza',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVb9L0k8uSf5_MNH8w0MYNmbyXFMc7LhlcOD3dD6tAxA4e0JmPFP86iAPok1liCsCHlQCWTV9VKaoJkgutegLNsu5_LQOr21bcRJtAV6k8NibhSTgNTH5xMUnIz_1xmCquJFSMOo0cYvfhsGE68AYwd9n7zaNNp5B6lHd08PQPKUbI93kJytuh92mrd1ZfF2AEX_T99TVJ3pACT7HcfOBp6V88SwPEMIDhvsjZpuC9M8ONxbV0xk_Q2qHB9mAW1mD7H0kTYb1-kTE',
    avatarAlt: 'Portrait of Carlos Mendoza',
    statusLabel: 'Active',
  },
  {
    id: '2024-001',
    name: 'Alice Johnson',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA66XOXiTqdob_f6s68d1obepSzwVPeAiRQw1mvtVGKpV4IkvQt5p7BgAv9e4IdNZNdWAvCV4ppsfswfZUzw3O-llockTGAjm5sER78yA6s7uHjVza1GTC0miubE1EMleR477VTsFeOUD3WKvSuBdRzPRQu5pIn1Qktyk0K0QiddrGne_jNCLQ6pJS002S_WhCEShE87k17vCwU7BBc9SRo5x_5XJQWj7_1AsFKnUrEOZVegzc6KT4nbDcfFbJLYZ2wqeSB0xAOi94',
    avatarAlt: 'Portrait of Alice Johnson',
    statusLabel: 'Active',
  },
  {
    id: '2023-452',
    name: 'Lucia Vargas',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4GJVCE_jaSDdhYtF3Uwr8IXA99jr3EBnu_i2liINH4v-m7cUaGfpyC8hYPXA61R7M9rnd2JmUxrPAIh2_XtKn5yw0HF6Wgm8FODOhLX8Lq7VblEFLV2qjf6no1s0tHG7Wi62PtAjlaP-X2S5d1D06rkHrsyyG76-tpuJ9NUwEdbvPKYSomnkRbZ27M_6LlLO3_QMUKd4zIrFySlfz3K5N2ktRUujqYOK7YVuKFU6U4tfWxwjq-lhvJRWr4EDbxJ33XJNWO5VkZ7w',
    avatarAlt: 'Portrait of Lucia Vargas',
    statusLabel: 'Active',
  },
];

export const LOAN_CREATE_BOOKS: readonly LoanCreateBookOption[] = [
  {
    id: 'BK-aleph',
    title: 'The Aleph and Other Stories',
    author: 'Jorge Luis Borges',
    isbn: '978-8499089530',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDbr8wscE-qrYaHUDFWUBEePgcaR8Jfj29TWFNvuLAkZi2mGfIz0Tll6xCGnx8yfFD-_IPm1B2fr7chcFCpqr5ukxkhF-luFz_3ewWhdNjgjuKpYgY1czAIK_rk1SHtp_SjGWKcG_trhGXG6rofnOoklhz5mUTI5kHYblVtOzSfkY4w7aT8DDfRzgIv4I2uqHumnCwTuR7y_G6eq8lcNPA0jsp_y7MFK06SstdeERsx6yf81Kl6D4Ylip9dvoq2lxW1obCI2LDx2I',
    coverAlt: 'Book cover: The Aleph',
  },
  {
    id: 'BK-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxVYdwstfibT_GgmzI37uPfCMouDTZS24DCuJditYq7AVtuDhkp65Mq_zPQI--kGMWflAr1SAriuqRzeXzyXpOv2VBslz-RknRuTT2X8qqdHCBThlo3Y6NzLkzuLz9t8Ho_xSktwt3SWIvWXTOrSCzlFLjBr7oW_SAVPZ4KqcysWcoaREKEy-dh0PKtuiJ8-jEMc3GPeEaG4Z-OuLHuwyahDlkFZapa8GTBD91KTGcAoFvTvT7pFOJbnmC8H71fsqMKFlkam3PpM',
    coverAlt: 'Book cover: The Great Gatsby',
  },
  {
    id: 'BK-dune',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441172719',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_o2aY_HR0vMoG1gjFelGtcjCJYSWa46nIU3S1dg_4TuOzgkVSfGWOZDQPeVndvv0DSj80bwgqR75jEAVRtMFp05wughGEB9gLXgA7oUGE9Bjhvi8wSIK-0laDWEIa470jerzIRtjppcGY8db1Dn7X0v4iO2qFhl4bdAVVZv6vDi12CKUC6mprU7qx0FcAXclST2YR7bmj81wiATNhpIuN-tRMj_i8GF5ce4XBytB6sHDIcl2YcAnMn1mLALgNyv4hOfyIn2EhSw',
    coverAlt: 'Book cover: Dune',
  },
];
