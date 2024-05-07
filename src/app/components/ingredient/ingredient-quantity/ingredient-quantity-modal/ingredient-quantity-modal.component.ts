import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { currency, unit } from 'src/app/utils/constants/constants';

@Component({
  selector: 'app-ingredient-quantity-modal',
  templateUrl: './ingredient-quantity-modal.component.html',
  styleUrls: ['./ingredient-quantity-modal.component.scss'],
})
export class IngredientQuantityModalComponent {
  ingredientQuantityForm: FormGroup;
  unit: string[] = unit;
  currency: string[] = currency;
  constructor(
    public dialogRef: MatDialogRef<IngredientQuantityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    const ingredientId = this.data.ingredientId;

    this.ingredientQuantityForm = this.formBuilder.group({
      amount: ['', Validators.required],
      unit: ['', Validators.required],
      price: ['', Validators.required],
      currency: ['', Validators.required],
      expiringDate: ['', Validators.required],
      dateOfPurchase: ['', Validators.required],
      ingredientId: ingredientId,
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
    } else {
      this.translate
        .get('NOTIFY.QUANTITY.CREATE.INVALID_VALUES')
        .subscribe((res: string) => {
          this.notificationsService.error(res, '', {
            timeOut: 5000,
          });
        });
    }
  }
}
