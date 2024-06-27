import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { CategoryService } from 'src/app/services/category/category.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { unit } from 'src/app/utils/constants/constants';
import { Observable } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';
import { IIngredint } from 'src/app/models/IIngredint';
import { IResponse } from 'src/app/models/IResponse';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit {
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
  filteredIngredients!: Observable<any[]>;
  options = {
    searchTerm: '',
    pageNumber: 1,
    pageSize: 10,
    SortOrder: 0,
  };

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
      picture: [''],
      cookingInstructions: ['', Validators.required],
      categories: this.fb.array([]),
      selectedIngredients: this.fb.array([], Validators.minLength(1)), // Require at least one ingredient
    });

    // Initialize ingredients form array with autocomplete inputs
    this.selectedIngredients = [];
  }

  ngOnInit() {
    this.getIngredients();
    this.getCategories();

    if (this.recipeId) {
      this.loadRecipeData(this.recipeId);
    }

    // Initialize filtered ingredients for each ingredient field
    (this.recipeForm.get('selectedIngredients') as FormArray).controls.forEach(
      (group: AbstractControl, index: number) => {
        if (group instanceof FormGroup) {
          this.initializeIngredientAutocomplete(group as FormGroup, index);
        }
      }
    );
  }

  private _filterIngredients(value: any): Observable<any[]> {
    if (typeof value !== 'string' || !value.trim()) {
      return this.ingredientService.getIngredientsPaginated(this.options).pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error occurred:', error);
          return [];
        })
      );
    }

    const filterValue = value.toLowerCase();
    this.options.searchTerm = filterValue;

    return this.ingredientService.getIngredientsPaginated(this.options).pipe(
      map((response) => {
        this.ingredients = response.data;
        return response.data.filter((ingredient: any) =>
          ingredient.name.toLowerCase().includes(filterValue)
        );
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return [];
      })
    );
  }

  initializeIngredientAutocomplete(group: FormGroup, index: number) {
    group.addControl('selectedIngredientInput', new FormControl(''));
    this.filteredIngredients = group
      .get('selectedIngredientInput')!
      .valueChanges.pipe(
        startWith(''),
        switchMap((value) => this._filterIngredients(value))
      );
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

        this.selectedIngredients.forEach((ingredient, index) => {
          const newIngredientControl = this.fb.group({
            selectedIngredient: [ingredient.id, Validators.required],
            selectedIngredientQuantity: [
              ingredient.quantity,
              Validators.required,
            ],
            selectedIngredientUnit: [ingredient.unit, Validators.required],
            selectedIngredientInput: [ingredient.name],
          });
          (this.recipeForm.get('selectedIngredients') as FormArray).push(
            newIngredientControl
          );
          this.initializeIngredientAutocomplete(newIngredientControl, index);
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getIngredients() {
    this.ingredientService.getIngredientsPaginated(this.options).subscribe(
      (response: IResponse<IIngredint[]>) => {
        this.ingredients = response.data;
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
    if (this.recipeForm.invalid) {
      this.translate
        .get('RECIPE.ERROR.FORM_INVALID')
        .subscribe((res: string) => {
          this.notificationsService.error(res, '', { timeOut: 5000 });
        });
      return;
    }

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
                this.notificationsService.success(res, '', { timeOut: 5000 });
              });
            window.history.back();
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.RECIPE.UPDATE.FAILED')
              .subscribe((res: string) => {
                this.notificationsService.error(res, '', { timeOut: 5000 });
              });
          }
        );
    } else {
      this.recipeService.addRecipe(recipeData).subscribe(
        (response: any) => {
          this.translate
            .get('NOTIFY.RECIPE.CREATE.SUCCESS')
            .subscribe((res: string) => {
              this.notificationsService.success(res, '', { timeOut: 5000 });
            });
          window.history.back();
        },
        (error: any) => {
          this.translate
            .get('NOTIFY.RECIPE.CREATE.FAILED')
            .subscribe((res: string) => {
              this.notificationsService.error(res, '', { timeOut: 5000 });
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

  addIngredientField() {
    const newIngredientControl = this.fb.group({
      selectedIngredient: [null, Validators.required],
      selectedIngredientQuantity: [null, Validators.required],
      selectedIngredientUnit: [null, Validators.required],
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
    this.initializeIngredientAutocomplete(
      newIngredientControl,
      this.selectedIngredients.length - 1
    );
  }

  removeIngredientField(index: number) {
    this.selectedIngredients.splice(index, 1);
    (this.recipeForm.get('selectedIngredients') as FormArray).removeAt(index);
  }

  onIngredientSelected(ingredient: any, index: number) {
    const selectedIngredientId = ingredient.id;
    const selectedIngredient = this.ingredients.find(
      (ing) => ing.id === selectedIngredientId
    );

    if (selectedIngredient) {
      const formArray = this.recipeForm.get('selectedIngredients') as FormArray;
      const formGroup = formArray.at(index) as FormGroup;

      // Update the form group with selected ingredient details
      formGroup.patchValue({
        selectedIngredient: selectedIngredient.id,
        selectedIngredientQuantity:
          formGroup.get('selectedIngredientQuantity')?.value ?? 0,
        selectedIngredientUnit:
          formGroup.get('selectedIngredientUnit')?.value ?? '',
      });

      // Set the selected ingredient's name in the input field
      formGroup
        .get('selectedIngredientInput')
        ?.setValue(selectedIngredient.name);

      // Update selectedIngredients array
      this.selectedIngredients[index] = {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: formGroup.get('selectedIngredientQuantity')?.value ?? 0,
        unit: formGroup.get('selectedIngredientUnit')?.value ?? '',
      };
    }
  }
}
