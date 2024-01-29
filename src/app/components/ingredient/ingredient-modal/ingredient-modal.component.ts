import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.scss'],
})
export class IngredientModalComponent {
  ingredientForm: FormGroup;
  categories: any[] = [];
  selectedCategoriesIds: any[] = [];
  selectedCategories: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<IngredientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      shortDescription: [''],
      description: [''],
      pictureURL: [''],
      categories: this.formBuilder.array([]),
    });

    // If editing, populate the form with existing data
    if (data && data.category) {
      this.ingredientForm.patchValue(data.category);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(
        map((response: any) => response.categories),
        map((categories: any[]) =>
          categories.filter((category) => category.isRecipe === false)
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
      (this.ingredientForm.controls['categories'] as FormArray).push(control);
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    // Verifică dacă a fost selectat un fișier
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Transformă imaginea în Base64
        const base64Image = e.target.result;

        // Setează codul Base64 în câmpul 'pictureURL' al formularului
        this.ingredientForm.get('pictureURL')?.setValue(base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  onSaveClick(): void {
    if (this.ingredientForm.valid) {
      const formData = this.ingredientForm.value;
      // Add any additional logic to handle form data as needed
      this.dialogRef.close(formData);
    }
  }
}
