import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent {
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortDescription: [''],
      description: [''],
      pictureURL: [''],
      isRecipe: [false],
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
    const file: File = event.target.files[0];

    // Verifică dacă a fost selectat un fișier
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Transformă imaginea în Base64
        const base64Image = e.target.result;

        // Setează codul Base64 în câmpul 'pictureURL' al formularului
        this.categoryForm.get('pictureURL')?.setValue(base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  onSaveClick(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      // Add any additional logic to handle form data as needed
      this.dialogRef.close(formData);
    }
  }
}
