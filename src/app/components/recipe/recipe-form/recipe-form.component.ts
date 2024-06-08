import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { CategoryService } from 'src/app/services/category/category.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { unit } from 'src/app/utils/constants/constants';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent {
  @Input() recipe: any;

  recipeForm: FormGroup;
  ingredients: any[] = [];
  categories: any[] = [];
  selectedIngredients: any[] = [];
  selectedCategoriesIds: any[] = [];
  selectedCategories: any[] = [];
  unit = unit;
  recipeId: string | null = this.route.snapshot.paramMap.get('id');
  selectedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: ['', Validators.required],
      picture: ['', Validators.required],
      cookingInstructions: ['', Validators.required],
      categories: this.fb.array([]),
      selectedIngredients: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.getIngredients();
    this.getCategories();

    if (this.recipeId) {
      this.loadRecipeData(this.recipeId);
    }
  }

  loadRecipeData(recipeId: string) {
    this.recipeService.getRecipeDetails(Number(recipeId)).subscribe(
      (response: any) => {
        const recipeDetails = response.recipe.result;
        this.recipeForm.patchValue({
          name: recipeDetails.name,
          description: recipeDetails.description,
          shortDescription: recipeDetails.shortDescription,
          picture: recipeDetails.Picture,
          cookingInstructions: recipeDetails.cookingInstructions,
        });

        recipeDetails.recipeCategories.map((category: any) => {
          this.selectedCategoriesIds.push(category.categoryId);
        });

        // Create an array of selected categories based on selectedCategoriesIds
        this.selectedCategories = this.categories.filter((category: any) =>
          this.selectedCategoriesIds.includes(category.id)
        );

        this.selectedIngredients = recipeDetails.recipeIngredients.map(
          (ingredient: any) => ({
            id: ingredient.ingredient.id,
            name: ingredient.ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })
        );

        this.selectedIngredients.forEach((ingredient) => {
          const newIngredientControl = this.fb.group({
            selectedIngredient: [ingredient.id],
            selectedIngredientQuantity: [ingredient.quantity],
            selectedIngredientUnit: [ingredient.unit],
          });
          (this.recipeForm.get('selectedIngredients') as FormArray).push(
            newIngredientControl
          );
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(
      (response: any) => {
        this.ingredients = response.ingredients;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategoriesByType(true).subscribe(
      (response: any) => {
        this.categories = response.data.result;
        this.populateCategories();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  populateCategories() {
    this.categories.forEach(() => {
      const control = new FormControl(false);
      (this.recipeForm.controls['categories'] as FormArray).push(control);
    });
  }

  onCategorySelectionChange(category: any) {
    if (!this.selectedCategoriesIds.includes(category.id)) {
      this.selectedCategoriesIds.push(category.id);

      const categoryExists = this.selectedCategories.some(
        (selectedCategory) => selectedCategory.id === category.id
      );

      if (!categoryExists) {
        this.selectedCategories.push(category);
      }
    }
  }

  removeCategory(index: number): void {
    if (index >= 0 && index < this.selectedCategoriesIds.length) {
      const removedCategoryId = this.selectedCategoriesIds.splice(index, 1)[0];

      // Remove the corresponding category from selectedCategories
      const removedCategoryIndex = this.selectedCategories.findIndex(
        (category) => category.id === removedCategoryId
      );

      if (removedCategoryIndex !== -1) {
        this.selectedCategories.splice(removedCategoryIndex, 1);
      }
    }
  }

  goBack() {
    window.history.back();
  }

  onSubmit() {
    const recipeData = {
      Recipe: {
        name: this.recipeForm.value.name,
        description: this.recipeForm.value.description,
        shortDescription: this.recipeForm.value.shortDescription,
        picture: this.recipeForm.value.picture,
        cookingInstructions: this.recipeForm.value.cookingInstructions,
      },
      Ingredients: this.selectedIngredients.map((ingredient) => ({
        ingredientId: ingredient.id,
        quantity: ingredient.quantity || 0,
        unit: ingredient.unit,
      })),
      Categories: this.selectedCategoriesIds,
    };

    if (this.recipeId) {
      this.recipeService
        .updateRecipe(Number(this.recipeId), recipeData)
        .subscribe(
          (response: any) => {
            this.translate
              .get('NOTIFY.RECIPE.UPDATE.SUCCESS')
              .subscribe((res: string) => {
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });

            location.reload();
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.RECIPE.UPDATE.FAILED')
              .subscribe((res: string) => {
                this.notificationsService.error(res, '', {
                  timeOut: 5000,
                });
              });
          }
        );
    } else {
      this.recipeService.addRecipe(recipeData).subscribe(
        (response: any) => {
          this.translate
            .get('NOTIFY.RECIPE.CREATE.SUCCESS')
            .subscribe((res: string) => {
              this.notificationsService.success(res, '', {
                timeOut: 5000,
              });
            });

          location.reload();
        },
        (error: any) => {
          this.translate
            .get('NOTIFY.RECIPE.CREATE.FAILED')
            .subscribe((res: string) => {
              this.notificationsService.error(res, '', {
                timeOut: 5000,
              });
            });
        }
      );
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.recipeForm.get('picture')?.setValue(base64Image);
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  addSelectedIngredient() {
    this.selectedIngredients.push({
      id: null,
      name: '',
      quantity: null,
      unit: '',
    });
  }

  addIngredientField() {
    const newIngredientControl = this.fb.group({
      selectedIngredient: [null],
      selectedIngredientQuantity: [null],
      selectedIngredientUnit: [null],
    });
    (this.recipeForm.get('selectedIngredients') as FormArray).push(
      newIngredientControl
    );
    this.selectedIngredients.push({
      id: null,
      name: '',
      quantity: null,
      unit: '',
    });
  }

  removeIngredientField(index: number) {
    this.selectedIngredients.splice(index, 1);
  }

  onIngredientSelected(event: any, index: number) {
    const selectedIngredientId = event?.value;
    const selectedIngredient = this.ingredients.find(
      (ingredient) => ingredient.id === +selectedIngredientId
    );

    if (selectedIngredient) {
      const existingIngredient = this.selectedIngredients.find(
        (ingredient) => ingredient.id === +selectedIngredientId
      );

      if (!existingIngredient) {
        this.selectedIngredients[index] = {
          ...selectedIngredient,
          quantity:
            this.recipeForm.get('selectedIngredients')?.value[index]
              ?.selectedIngredientQuantity || 0,
          unit:
            this.recipeForm.get('selectedIngredients')?.value[index]
              ?.selectedIngredientUnit || '',
        };
      }
    }
  }

  onIngredientQuantityChanged(event: any, index: number) {
    this.selectedIngredients[index].quantity = event.value;
  }

  onIngredientUnitChanged(event: any, index: number) {
    this.selectedIngredients[index].unit = event.value;
  }
}
