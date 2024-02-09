import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailDialogComponent } from '../modal/change-email-dialog/change-email-dialog.component';
import { ChangePasswordDialogComponent } from '../modal/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isDropdownOpen = false;

  constructor(
    protected authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Dacă utilizatorul a confirmat, execută delogarea
        this.authService.logout();
        this.router.navigateByUrl('/');
      }
    });
  }

  changeEmail(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: '300px', // Opțional: poți specifica lățimea modalului
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  changePassword(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '300px', // Opțional: poți specifica lățimea modalului
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
