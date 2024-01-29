import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ingredient-quantity-modal',
  templateUrl: './ingredient-quantity-modal.component.html',
  styleUrls: ['./ingredient-quantity-modal.component.scss'],
})
export class IngredientQuantityModalComponent {
  ingredientQuantityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<IngredientQuantityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.ingredientQuantityForm = this.formBuilder.group({
      amount: ['', Validators.required],
      unit: [''],
      expiringDate: [''],
      dateOfPurchase: [''],
    });

    // If editing, populate the form with existing data
    if (data && data.ingredientQuantity) {
      this.ingredientQuantityForm.patchValue(data.ingredientQuantity);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.ingredientQuantityForm.valid) {
      const formData = this.ingredientQuantityForm.value;
      // Add any additional logic to handle form data as needed
      this.dialogRef.close(formData);
    }
  }
}
