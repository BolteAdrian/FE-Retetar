import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private notificationsService: NotificationsService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService
        .forgotPassword(String(this.forgotPasswordForm.value.email))
        .subscribe(
          (response: any) => {
            this.translate
              .get('NOTIFY.SEND_LINK_SUCCESS')
              .subscribe((res: string) => {
                this.message = res;
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.SEND_LINK_FAILED')
              .subscribe((res: string) => {
                this.message = res;
              });
            this.notificationsService.error(error.message, '', {
              timeOut: 5000,
            });
          }
        );
    }
  }
}
