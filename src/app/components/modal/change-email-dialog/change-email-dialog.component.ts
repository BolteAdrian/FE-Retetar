import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss'],
})
export class ChangeEmailDialogComponent {
  newEmail: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
    private notificationsService: NotificationsService,
    protected authService: AuthService,
    private translate: TranslateService
  ) {}

  updateEmail(): void {
    this.authService.updateEmail(this.newEmail).subscribe(
      (response: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.CHANGE_EMAIL.SUCCESS')
          .subscribe((res: string) => {
            this.notificationsService.success(res, '', {
              timeOut: 5000,
            });
          });

        this.dialogRef.close();
      },
      (error: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.CHANGE_EMAIL.FAILED')
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
