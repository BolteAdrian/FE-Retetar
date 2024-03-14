import { Component } from '@angular/core';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { NgForm } from '@angular/forms';
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
    private notificationsService: NotificationsService
  ) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      this.authService.login(this.user).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
          this.notificationsService.success(response.status, response.message, {
            timeOut: 5000,
          });
        },
        (error: any) => {
          this.isLoading = false;
          this.error = 'Login failed. Please check your credentials.';
          this.notificationsService.error(error.status, error.message, {
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
    // Implement changePassword logic here
  }
}
