import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: IUserAuth = { userName: '', email: '', password: '' }; // Inițializează utilizatorul cu datele introduse în formular
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
      this.authService.register(this.user).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.router.navigateByUrl('/login');
          this.notificationsService.success(response.status, response.message, {
            timeOut: 5000,
          });
        },
        (error: any) => {
          this.isLoading = false;
          this.error =
            'Înregistrare eșuată. Verificați utilizatorul și parola.';
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
}
