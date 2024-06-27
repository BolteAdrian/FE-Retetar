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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isDropdownOpen: boolean = false;
  languages: ILanguageSwitcher[] = languages;
  currencyOptions: string[] = currency;
  currencyControl: FormControl;
  nightModeControl: boolean = false;
  languageControl: FormControl;
  static settings: FormGroup;

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
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
        this.nightModeControl = response.result.nightMode;
        this.currencyControl.setValue(response.result.currency);
        this.languageControl.setValue(response.result.language);
        localStorage.setItem('theme', this.nightModeControl ? 'dark' : 'light');
        this.translate.use(response.result.language.toLowerCase());
        this.updateTheme();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  updateSettings() {
    const settingsValue = {
      ...NavbarComponent.settings.value,
      nightMode: this.nightModeControl,
    };
    this.authService.setSettings(settingsValue).subscribe((result: any) => {
      this.nightModeControl = settingsValue.nightMode;
      localStorage.setItem('theme', this.nightModeControl ? 'dark' : 'light');
      this.updateTheme();
      this.notificationsService.success(result.message, 'Settings updated', {
        timeOut: 5000,
      });
    });
  }

  toggleTheme() {
    this.nightModeControl = !this.nightModeControl;
    this.updateSettings();
  }

  updateTheme(): void {
    if (this.nightModeControl) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  setCurrency(currency: any) {
    this.currencyControl.setValue(currency.value);
    NavbarComponent.settings.controls['currency'].setValue(currency.value);
    this.authService
      .setSettings({
        ...NavbarComponent.settings.value,
        currency: currency.value,
      })
      .subscribe((result: any) => {
        location.reload(); //reload the page after we change the currency to make a new api call to ExchangeRate
        this.notificationsService.success(result.message, 'Currency updated', {
          timeOut: 5000,
        });
      });
  }

  setLanguage(language: any) {
    this.languageControl.setValue(language.value);
    NavbarComponent.settings.controls['language'].setValue(language.value);
    this.authService
      .setSettings({
        ...NavbarComponent.settings.value,
        language: language.value,
      })
      .subscribe((result: any) => {
        this.notificationsService.success(result.message, 'Language updated', {
          timeOut: 5000,
        });
        this.translate.use(language.value.toLowerCase());
      });
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
        this.translate
          .get('NOTIFY.ACCOUNT.LOGOUT.SUCCESS')
          .subscribe((res: string) => {
            this.notificationsService.success(res, '', {
              timeOut: 5000,
            });
          });
      }
    });
  }

  changeEmail(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  changePassword(): void {
    this.isDropdownOpen = false;
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
