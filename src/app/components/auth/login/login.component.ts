import { Component } from '@angular/core';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: IUserAuth = { email: '', password: '' };
  error: string = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      this.authService.login(this.user).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
          this.translate
            .get('NOTIFY.LOGIN_SUCCESS')
            .subscribe((res: string) => {
              this.notificationsService.success(res, '', {
                timeOut: 5000,
              });
            });
        },
        (error: any) => {
          this.isLoading = false;
          this.translate.get('NOTIFY.LOGIN_FAILED').subscribe((res: string) => {
            this.error = res; // Obține traducerea și setează eroarea
          });
          this.notificationsService.error(error.message, '', {
            timeOut: 5000,
          });
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    // in work
  }
}
