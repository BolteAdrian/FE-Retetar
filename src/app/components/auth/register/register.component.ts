import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      (response: any) => {
        this.router.navigateByUrl('/');
      },
      (error: Error) => {
        this.error = 'Înregistrare eșuată. Verificați utilizatorul și parola.';
        console.log(error.message);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
