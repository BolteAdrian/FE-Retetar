import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    protected authService: AuthService
  ) {}

  updateEmail(): void {
    this.authService.updateEmail(this.newEmail).subscribe((response: any) => {
      // Dacă actualizarea a fost reușită, poți face orice acțiune suplimentară aici (cum ar fi afișarea unui mesaj de succes)
      this.dialogRef.close();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
