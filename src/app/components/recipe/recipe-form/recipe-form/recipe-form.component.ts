import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
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
  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private categoryService: CategoryService,
    private recipeService: RecipeService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      cookingInstructions: ['', Validators.required],
      categories: this.fb.array([]),
      selectedIngredients: this.fb.array([]), // Change to an array of form controls
    });
  }

  ngOnInit() {
    this.getIngredients();
    this.getCategories();
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

  onCategorySelectionChange(categoryId: any) {
    this.selectedCategoriesIds.push(categoryId);
  }

  onSubmit() {
    console.log(this.selectedIngredients);
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
