import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    // Închide dialogul și trimite înapoi true pentru a confirma acțiunea
    this.dialogRef.close(true);

    // Afișează o notificare pentru confirmare
    this.translate
      .get('NOTIFY.ACCOUNT.DELETE.SUCCESS')
      .subscribe((res: string) => {
        this.notificationsService.success(res, '', {
          timeOut: 5000,
        });
      });
  }
}
