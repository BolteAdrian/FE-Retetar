import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeDetails: any = {};
  recipeAmount: number = 0;
  id: number = 0;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getRecipeDetails();
  }

  goToRecipeUpdate(): void {
    this.router.navigateByUrl('/recipe/edit/' + this.id);
  }

  getRecipeDetails(): void {
    if (this.id !== null) {
      this.recipeService.getRecipeDetails(this.id).subscribe(
        (response: any) => {
          console.log(response.recipe.result);
          this.recipeDetails = response.recipe.result;
        },
        (error: any) => {
          console.error(error);
        }
      );
      this.recipeService.maxAmount(this.id).subscribe(
        (response: any) => {
          this.recipeAmount = response.recipeAmount;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
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
            location.reload();
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
