import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { ISendEmail } from 'src/app/models/ISendEmail';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss'],
})
export class EmailModalComponent {
  emailData: ISendEmail = {
    email: '',
    subject: '',
    message: '',
  };
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<EmailModalComponent>,
    private notificationsService: NotificationsService,
    private apiService: AuthService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.emailData.attachment = event.target.files[0];
  }

  sendEmailWithAttachment() {
    const formData = new FormData();
    formData.append('email', this.emailData.email);
    formData.append('subject', this.emailData.subject);
    formData.append('message', this.emailData.message);
    if (this.emailData.attachment) {
      formData.append('attachment', this.emailData.attachment);
    }

    this.apiService.sendEmailWithAttachment(formData).subscribe(
      (response: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.SEND_EMAIL.SUCCESS')
          .subscribe((res: string) => {
            this.notificationsService.success(res, '', {
              timeOut: 5000,
            });
          });

        this.dialogRef.close();
      },
      (error: any) => {
        this.translate
          .get('NOTIFY.ACCOUNT.SEND_EMAIL.FAILED')
          .subscribe((res: string) => {
            this.notificationsService.error(res, '', {
              timeOut: 5000,
            });
          });
      }
    );
  }
}
