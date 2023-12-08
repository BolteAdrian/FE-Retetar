import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private recipeService: RecipeService
  ) {}

  performOperation(): void {
    switch (this.data.operation) {
      case 'add':
        // Your logic to add an item
        break;
      case 'edit':
        // Your logic to edit an item
        break;
      default:
        // Handle any other operation or throw an error
        break;
    }
    this.dialogRef.close();
  }

  performDelete(): void {
    // Implement delete logic using this.data.rowData for the selected row
    this.recipeService.deleteRecipe(this.data.rowData.id).subscribe(
      (response: any) => {
        // Handle success or refresh data
        this.dialogRef.close();
      },
      (error: any) => {
        // Handle error
        console.error(error);
        // Close dialog or show error message
        this.dialogRef.close();
      }
    );
  }
}
