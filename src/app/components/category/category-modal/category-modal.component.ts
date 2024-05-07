import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent {
  categoryForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      picture: [''],
      isRecipe: data.type,
    });

    // If editing, populate the form with existing data
    if (data && data.category) {
      this.categoryForm.patchValue(data.category);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Image = e.target.result;

        this.categoryForm.get('picture')?.setValue(base64Image);
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSaveClick(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      this.dialogRef.close(formData);
    } else {
      this.translate
        .get('NOTIFY.CATEGORY.CREATE.INVALID_NAME')
        .subscribe((res: string) => {
          this.notificationsService.error(res, '', {
            timeOut: 5000,
          });
        });
    }
  }
}
