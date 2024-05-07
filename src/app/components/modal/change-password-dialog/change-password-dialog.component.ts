import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    protected authService: AuthService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {}

  updatePassword(): void {
    const model = {
      CurrentPassword: this.currentPassword,
      NewPassword: this.newPassword,
    };

    this.authService.updatePassword(model).subscribe(
      (response: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.CHANGE_PASSWORD.SUCCESS')
          .subscribe((res: string) => {
            this.notificationsService.success(res, '', {
              timeOut: 5000,
            });
          });

        this.dialogRef.close();
      },
      (error: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.CHANGE_PASSWORD.FAILED')
          .subscribe((res: string) => {
            this.notificationsService.error(res, '', {
              timeOut: 5000,
            });
          });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
