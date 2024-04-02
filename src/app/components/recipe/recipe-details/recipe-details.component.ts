import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import { IRecipeAmount } from 'src/app/models/IRecipeAmount';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeDetails: any = {};
  recipeAmount: IRecipeAmount | undefined;
  id: number = 0;
  quantityForm: FormGroup;
  missingIngredients: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.quantityForm = this.fb.group({
      quantity_to_use: [''],
    });
  }

  ngOnInit() {
    this.getRecipeDetails();
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const element = document.getElementById('recipe-details'); // Get the HTML element containing the recipe details
    if (element) {
      // Convert HTML element to canvas
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // Width of the PDF document (A4 size)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('recipe_details.pdf');
      });
    } else {
      console.error('Element not found');
    }
  }
  goToRecipeUpdate(): void {
    this.router.navigateByUrl('edit-recipe/' + this.id);
  }

  getRecipeDetails(): void {
    if (this.id !== null) {
      this.recipeService.getRecipeDetails(this.id).subscribe(
        (response: any) => {
          this.recipeDetails = response.recipe.result;
        },
        (error: any) => {
          console.error(error);
        }
      );
      this.recipeService.maxAmount(this.id).subscribe(
        (response: any) => {
          this.recipeAmount = response.recipeAmount.result;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  onSubmit() {
    const quantityValue = this.quantityForm.value.quantity_to_use;

    this.recipeService.submitAmount(this.id, quantityValue).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.notificationsService.success(
            response.status,
            'The recipes quantity was submited',
            {
              timeOut: 5000,
            }
          );
        } else {
          this.missingIngredients = response.message;
          this.notificationsService.error(
            response.status,
            'Missing ingredients',
            {
              timeOut: 5000,
            }
          );
        }
      },
      (error: any) => {
        this.notificationsService.error(error.status, error.message, {
          timeOut: 5000,
        });
      }
    );
  }

  goBack() {
    window.history.back();
  }

  openDeleteConfirmation(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // User confirmed delete, perform your delete logic here
        this.recipeService.deleteRecipe(this.id).subscribe(
          (response: any) => {
            this.notificationsService.success(
              response.status,
              response.message,
              {
                timeOut: 5000,
              }
            );
            window.history.back();
          },
          (error: any) => {
            this.notificationsService.error(error.status, error.message, {
              timeOut: 5000,
            });
          }
        );
      }
    });
  }
}
