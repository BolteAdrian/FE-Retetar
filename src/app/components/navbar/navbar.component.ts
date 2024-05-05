import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailDialogComponent } from '../modal/change-email-dialog/change-email-dialog.component';
import { ChangePasswordDialogComponent } from '../modal/change-password-dialog/change-password-dialog.component';
import { NotificationsService } from 'angular2-notifications';
import { ILanguageSwitcher } from 'src/app/models/ILanguageSwitcher';
import { currency, languages } from 'src/app/utils/constants/constants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isDropdownOpen = false;
  languages: ILanguageSwitcher[] = languages;
  currencyOptions: string[] = currency;
  currencyControl: FormControl;
  languageControl: FormControl;
  static settings: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService
  ) {
    this.currencyControl = new FormControl(
      this.currencyOptions[0],
      Validators.required
    );
    this.languageControl = new FormControl(
      this.languages[0].code,
      Validators.required
    );

    NavbarComponent.settings = this.fb.group({
      nightMode: [false, Validators.required],
      currency: [this.currencyOptions[0], Validators.required],
      language: [this.languages[0].code, Validators.required],
    });
  }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this.authService.getSettings().subscribe(
      (response: any) => {
        NavbarComponent.settings.patchValue(response.result);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  updateSettings() {
    this.authService
      .setSettings(NavbarComponent.settings.value)
      .subscribe((result: any) => {
        this.notificationsService.success(result.message, 'Settings updated', {
          timeOut: 5000,
        });
      });
  }

  toggleTheme() {
    NavbarComponent.settings.value.nightMode =
      !NavbarComponent.settings.value.nightMode;
    this.updateSettings();
  }

  setCurrency(currency: any) {
    (NavbarComponent.settings.controls['currency'] as FormControl).setValue(
      currency.value
    );
    this.updateSettings();
  }

  setLanguage(language: any) {
    (NavbarComponent.settings.controls['language'] as FormControl).setValue(
      language.value
    );
    this.updateSettings();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigateByUrl('/');
        this.notificationsService.success(result, 'Logout successful', {
          timeOut: 5000,
        });
      }
    });
  }

  changeEmail(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  changePassword(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
