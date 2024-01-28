import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/services/category/category.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent {
  @Input() recipe: any; // Obiectul rețetei pentru adăugare sau actualizare

  recipeForm: FormGroup;
  ingredients: any[] = [];
  categories: any[] = [];
  selectedIngredients: any[] = [];
  selectedCategoriesIds: any[] = [];
  selectedCategories: any[] = [];
  recipeId: string | null = this.route.snapshot.paramMap.get('id');
  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private categoryService: CategoryService,
    private recipeService: RecipeService,
    private route: ActivatedRoute
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

    // Verifică dacă există un parametru 'id' în URL pentru a decide între adăugare și editare

    if (this.recipeId) {
      // Pagină de editare
      this.loadRecipeData(this.recipeId);
    }
  }

  loadRecipeData(recipeId: string) {
    this.recipeService.getRecipeDetails(Number(recipeId)).subscribe(
      (response: any) => {
        // Completează formularul cu datele rețetei existente pentru editare
        const recipeDetails = response.recipe;
        this.recipeForm.patchValue({
          name: recipeDetails.recipe.name,
          description: recipeDetails.recipe.description,
          cookingInstructions: recipeDetails.recipe.cookingInstructions,
        });

        recipeDetails.categories.map((category: any) => {
          this.selectedCategoriesIds.push(category.categoryId);
        });

        // Create an array of selected categories based on selectedCategoriesIds
        this.selectedCategories = this.categories.filter((category: any) =>
          this.selectedCategoriesIds.includes(category.id)
        );

        // Setează ingredientele selectate
        this.selectedIngredients = recipeDetails.ingredients.map(
          (ingredient: any) => ({
            id: ingredient.ingredient.id,
            name: ingredient.ingredient.name,
            quantity: ingredient.quantity,
          })
        );

        // Adaugă controlurile pentru fiecare ingredient existent
        this.selectedIngredients.forEach((ingredient) => {
          const newIngredientControl = this.fb.group({
            selectedIngredient: [ingredient.id],
            selectedIngredientQuantity: [ingredient.quantity],
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
        // Manipulează datele primite aici
        this.ingredients = response.ingredients;
      },
      (error: any) => {
        // Gestionează erorile aici
        console.error(error);
      }
    );
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(
        map((response: any) => response.categories),
        map((categories: any[]) =>
          categories.filter((category) => category.isRecipe === true)
        )
      )
      .subscribe(
        (filteredCategories: any[]) => {
          this.categories = filteredCategories;
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
    // Verifică dacă category.id există deja în selectedCategoriesIds
    if (!this.selectedCategoriesIds.includes(category.id)) {
      // Adaugă id-ul în array doar dacă nu există deja
      this.selectedCategoriesIds.push(category.id);

      // Verifică dacă category nu există deja în selectedCategories
      const categoryExists = this.selectedCategories.some(
        (selectedCategory) => selectedCategory.id === category.id
      );

      // Adaugă category în array doar dacă nu există deja
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

  onSubmit() {
    const recipeData = {
      Recipe: {
        name: this.recipeForm.value.name,
        description: this.recipeForm.value.description,
        cookingInstructions: this.recipeForm.value.cookingInstructions,
      },
      Ingredients: this.selectedIngredients.map((ingredient) => ({
        ingredientId: ingredient.id,
        quantity: ingredient.quantity || 0,
      })),
      Categories: this.selectedCategoriesIds,
    };

    if (this.recipeId) {
      this.recipeService
        .updateRecipe(Number(this.recipeId), recipeData)
        .subscribe(
          (response: any) => {
            // Handle server response or success
            console.log(response);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.recipeService.addRecipe(recipeData).subscribe(
        (response: any) => {
          // Handle server response or success
          console.log(response);
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  addSelectedIngredient() {
    this.selectedIngredients.push({ id: null, name: '', quantity: null }); // Adaugă un obiect gol pentru un nou ingredient
  }

  addIngredientField() {
    const newIngredientControl = this.fb.group({
      selectedIngredient: [null],
      selectedIngredientQuantity: [null],
    });
    (this.recipeForm.get('selectedIngredients') as FormArray).push(
      newIngredientControl
    );
    this.selectedIngredients.push({ id: null, name: '', quantity: null });
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
        };

        const quantityControl = (
          this.recipeForm.get('selectedIngredients') as FormArray
        )
          .at(index)
          .get('selectedIngredientQuantity');
        if (quantityControl) {
          quantityControl.valueChanges.subscribe((value) => {
            this.selectedIngredients[index].quantity = value || 0;
          });
        }
      }
    }
  }
}
