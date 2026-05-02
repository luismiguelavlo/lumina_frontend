import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LumStudentsPageToolbarComponent } from '../../../../shared/ui/organisms/lum-students-page-toolbar/lum-students-page-toolbar.component';
import { LumStudentsTableComponent } from '../../../../shared/ui/organisms/lum-students-table/lum-students-table.component';
import type { StudentPatronRow } from '../../../../shared/models/student-patron.model';
import { StudentsManagementStore } from './students-management.store';
import { LumCreateStudentModalComponent } from '../../../../shared/ui/organisms/lum-create-student-modal/lum-create-student-modal.component';

@Component({
  selector: 'app-students-management-page',
  imports: [LumStudentsPageToolbarComponent, LumStudentsTableComponent, LumCreateStudentModalComponent],
  providers: [StudentsManagementStore],
  templateUrl: './students-management.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsManagementPage {
  private readonly router = inject(Router);
  protected readonly store = inject(StudentsManagementStore);

  protected onAddStudent(): void {
    this.store.openCreateModal();
  }

  protected onViewProfile(row: StudentPatronRow): void {
    void this.router.navigate(['/admin', 'students', row.routeId ?? row.patronId]);
  }
}
