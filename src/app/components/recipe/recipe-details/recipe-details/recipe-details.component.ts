import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeDetails: any; // Aici vei stoca detaliile rețetei
  recipeAmount: number = 0;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRecipeDetails();
  }

  goToRecipeUpdate(id: number): void {
    this.router.navigateByUrl('/recipe/edit/' + id);
  }

  getRecipeDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const recipeId = +id;
      this.recipeService.getRecipeDetails(recipeId).subscribe(
        (response: any) => {
          this.recipeDetails = response.recipe;
        },
        (error: any) => {
          console.error(error);
        }
      );
      this.recipeService.maxAmount(recipeId).subscribe(
        (response: any) => {
          this.recipeAmount = response.recipeAmount;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
}
