import type { SanctionRow } from '../../../shared/models/sanction-row.model';

export const SANCTIONS_DEMO_ROWS: readonly SanctionRow[] = [
  {
    id: 'SN-001',
    studentName: 'Carlos Mendoza',
    recordId: '2024-001',
    initials: 'CM',
    reason:
      'Late return of reserve material (more than 3 business days). Book: "Advanced Data Structures".',
    appliedOnLabel: '12 Oct 2023',
    appliedByLabel: 'Admin (LAW-01)',
  },
  {
    id: 'SN-002',
    studentName: 'Lucia Vargas',
    recordId: '2023-452',
    initials: 'LV',
    reason: 'Reported damage to binding of historical material. Collection: 19th century.',
    appliedOnLabel: '15 Oct 2023',
    appliedByLabel: 'Staff (S-104)',
  },
  {
    id: 'SN-003',
    studentName: 'Javier Rios',
    recordId: '2025-112',
    initials: 'JR',
    reason: 'Misuse of silent study rooms. Multiple incidents this semester.',
    appliedOnLabel: '18 Oct 2023',
    appliedByLabel: 'Admin (LAW-01)',
  },
  {
    id: 'SN-004',
    studentName: 'Nina Patel',
    recordId: '2024-089',
    initials: 'NP',
    reason: 'Repeated noise violations in the research reading room after warnings.',
    appliedOnLabel: '22 Oct 2023',
    appliedByLabel: 'Staff (S-104)',
  },
];
