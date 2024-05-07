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
import { EmailModalComponent } from '../../modal/email-modal/email-modal.component';
import { CurrencyConversionService } from 'src/app/services/currency-conversion/currency-conversion.service';
import { TranslateService } from '@ngx-translate/core';

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
    private notificationsService: NotificationsService,
    private currencyConversionService: CurrencyConversionService,
    private translate: TranslateService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.quantityForm = this.fb.group({
      quantity_to_use: [''],
    });
  }

  ngOnInit() {
    this.getRecipeDetails();
  }

  convertPrice(value: number, fromCurrency: string): number {
    return this.currencyConversionService.convertPrice(value, fromCurrency);
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
          this.translate
            .get('NOTIFY.QUANTITY.SUBMIT.SUCCESS')
            .subscribe((res: string) => {
              this.notificationsService.success(res, '', {
                timeOut: 5000,
              });
            });
        } else {
          this.missingIngredients = response.message;
          this.translate
            .get('NOTIFY.QUANTITY.SUBMIT.FAILED')
            .subscribe((res: string) => {
              this.notificationsService.error(res, '', {
                timeOut: 5000,
              });
            });
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
            this.translate
              .get('NOTIFY.QUANTITY.REMOVE.SUCCESS')
              .subscribe((res: string) => {
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });

            window.history.back();
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.QUANTITY.REMOVE.FAILED')
              .subscribe((res: string) => {
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });
          }
        );
      }
    });
  }

  openEmailModal() {
    const dialogRef = this.dialog.open(EmailModalComponent, {
      width: '400px',
      data: {}, // You can pass any data to the modal if needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The email modal was closed');
      // You can handle any actions after the modal is closed here
    });
  }
}
