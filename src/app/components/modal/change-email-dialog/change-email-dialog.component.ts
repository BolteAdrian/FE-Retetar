import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    protected authService: AuthService
  ) {}

  updateEmail(): void {
    this.authService.updateEmail(this.newEmail).subscribe(
      (response: any) => {
        this.notificationsService.success(response.status, response.message, {
          timeOut: 5000,
        });
        this.dialogRef.close();
      },
      (error: any) => {
        this.notificationsService.error(error.status, error.message, {
          timeOut: 5000,
        });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
