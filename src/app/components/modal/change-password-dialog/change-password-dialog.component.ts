import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    protected authService: AuthService
  ) {}

  updatePassword(): void {
    const model = {
      CurrentPassword: this.currentPassword,
      NewPassword: this.newPassword,
    };

    this.authService.updatePassword(model).subscribe((response: any) => {
      // Dacă actualizarea a fost reușită, poți face orice acțiune suplimentară aici (cum ar fi afișarea unui mesaj de succes)
      this.dialogRef.close();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
