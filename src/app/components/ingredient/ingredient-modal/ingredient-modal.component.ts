import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.scss'],
})
export class IngredientModalComponent {
  ingredientForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<IngredientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      picture: [''],
      selectedCategory: [''],
    });

    // If editing, populate the form with existing data
    if (data) {
      this.ingredientForm.patchValue(data.ingredient);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.ingredientForm.get('picture')?.setValue(base64Image);
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSaveClick(): void {
    if (this.ingredientForm.valid) {
      const formData = this.ingredientForm.value;

      this.dialogRef.close(formData);
    } else {
      this.translate
        .get('NOTIFY.INGREDIENT.CREATE.INVALID_VALUES')
        .subscribe((res: string) => {
          this.notificationsService.error(res, '', {
            timeOut: 5000,
          });
        });
    }
  }
}
