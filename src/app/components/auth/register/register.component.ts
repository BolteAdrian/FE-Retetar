import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: IUserAuth = { userName: '', email: '', password: '' };
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
      this.authService.register(this.user).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.router.navigateByUrl('/login');
          this.translate
            .get('NOTIFY.REGISTER_SUCCESS')
            .subscribe((res: string) => {
              this.notificationsService.success(res, '', {
                timeOut: 5000,
              });
            });
        },
        (error: any) => {
          this.isLoading = false;
          this.translate
            .get('NOTIFY.REGISTER_FAILED')
            .subscribe((res: string) => {
              this.error = res;
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
}
