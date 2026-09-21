import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LumIconComponent } from '../../../../shared/ui/atoms/lum-icon/lum-icon.component';
import { LumStudentAdminActionsBarComponent } from '../../../../shared/ui/molecules/lum-student-admin-actions-bar/lum-student-admin-actions-bar.component';
import { LumStudentBadgeGalleryComponent } from '../../../../shared/ui/organisms/lum-student-badge-gallery/lum-student-badge-gallery.component';
import { LumStudentLoanHistoryComponent } from '../../../../shared/ui/organisms/lum-student-loan-history/lum-student-loan-history.component';
import { LumStudentProfileHeroComponent } from '../../../../shared/ui/organisms/lum-student-profile-hero/lum-student-profile-hero.component';
import { LumStudentProfileStatsSectionComponent } from '../../../../shared/ui/organisms/lum-student-profile-stats-section/lum-student-profile-stats-section.component';
import { LumCreateStudentModalComponent } from '../../../../shared/ui/organisms/lum-create-student-modal/lum-create-student-modal.component';
import { LumCreateFineModalComponent } from '../../../../shared/ui/organisms/lum-create-fine-modal/lum-create-fine-modal.component';
import { LumCreateSanctionModalComponent } from '../../../../shared/ui/organisms/lum-create-sanction-modal/lum-create-sanction-modal.component';
import { LumConfirmActionModalComponent } from '../../../../shared/ui/organisms/lum-confirm-action-modal/lum-confirm-action-modal.component';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { StudentDetailStore } from './student-detail.store';

@Component({
  selector: 'app-student-detail-page',
  imports: [
    RouterLink,
    LumIconComponent,
    LumStudentAdminActionsBarComponent,
    LumStudentProfileHeroComponent,
    LumStudentProfileStatsSectionComponent,
    LumStudentBadgeGalleryComponent,
    LumStudentLoanHistoryComponent,
    LumCreateStudentModalComponent,
    LumCreateFineModalComponent,
    LumCreateSanctionModalComponent,
    LumConfirmActionModalComponent,
    TranslatePipe,
  ],
  providers: [StudentDetailStore],
  templateUrl: './student-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDetailPage {
  protected readonly store = inject(StudentDetailStore);
  protected readonly isDeactivateConfirmOpen = signal(false);

  protected startSanctionFlow(): void {
    this.store.openSanctionModal();
  }

  protected startFineFlow(): void {
    this.store.openFineModal();
  }

  protected onEditProfile(): void {
    this.store.openEditModal();
  }

  protected onDeactivateUser(): void {
    this.isDeactivateConfirmOpen.set(true);
  }

  protected cancelDeactivateUser(): void {
    if (this.store.isDeactivating()) return;
    this.isDeactivateConfirmOpen.set(false);
  }

  protected confirmDeactivateUser(): void {
    this.store.deactivateStudent();
    this.isDeactivateConfirmOpen.set(false);
  }
}
