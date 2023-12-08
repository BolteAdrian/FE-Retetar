import { Component } from '@angular/core';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: IUserAuth = { email: '', password: '' }; // Inițializează utilizatorul cu datele introduse în formular
  error: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.user).subscribe(
      (response:any) => {
        this.router.navigateByUrl('/');
      },
      (error: Error) => {
        this.error = 'Autentificare eșuată. Verificați utilizatorul și parola.';
        console.log(error.message);
      }
    );
  }
}
