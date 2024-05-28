import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  message: string | null = null;
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.email && this.token) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      this.authService
        .resetPassword(this.email, this.token, newPassword)
        .subscribe(
          (response: any) => {
            this.message = 'Parola a fost resetată cu succes.';
            this.router.navigate(['/login']);
          },
          (error: any) => {
            this.message = 'Ceva n-a mers bine. Încercați din nou.';
          }
        );
    }
  }
}
