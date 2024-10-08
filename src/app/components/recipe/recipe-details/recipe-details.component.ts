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
import { IMissingIngredients } from 'src/app/models/IMissingIngredients';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeDetails: any = {};
  userRole!: string | null;
  recipeAmount: IRecipeAmount | undefined;
  id: number = 0;
  quantityForm: FormGroup;
  missingIngredients: IMissingIngredients[] = [];
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService,
    private currencyConversionService: CurrencyConversionService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.quantityForm = this.fb.group({
      quantity_to_use: [''],
    });
  }

  ngOnInit() {
    this.getRecipeDetails();
    this.userRole = this.authService.getUserRole();
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
        const imgWidth = 210;
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
    this.isLoading = true;
    if (this.id !== null) {
      this.recipeService.getRecipeDetails(this.id).subscribe(
        (response: any) => {
          this.recipeDetails = response.recipe.result;
          this.getMaxAmount();
          this.isLoading = false;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  getMaxAmount(): void {
    this.recipeService.maxAmount(this.id).subscribe(
      (response: any) => {
        this.recipeAmount = response.recipeAmount.result;
        this.isLoading = false;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    const quantityValue = this.quantityForm.value.quantity_to_use;

    this.recipeService.submitAmount(this.id, quantityValue).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.translate
            .get('NOTIFY.QUANTITY.SUBMIT.SUCCESS')
            .subscribe((res: string) => {
              this.getMaxAmount();
              this.missingIngredients = [];
              this.notificationsService.success(res, '', {
                timeOut: 5000,
              });
            });
        } else {
          this.missingIngredients = response.missingIngredients;
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
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The email modal was closed');
    });
  }
}
