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
  selectedCategory: any = null;

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
      picture: [''],
      selectedCategory: [''],
    });

    // If editing, populate the form with existing data
    if (data && data.category) {
      this.ingredientForm.patchValue(data.category);
      this.ingredientForm
        .get('selectedCategory')
        ?.setValue(data.category.categoryId);

      // Setează selectedCategory în funcție de data.category
      this.selectedCategory = this.categories.find(
        (category) => category.id === data.category.categoryId
      );
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

  onCategoryChange(event: any): void {
    const selectedCategoryId = event.value;
    this.selectedCategory = this.categories.find(
      (category) => category.id === selectedCategoryId
    );
  }

  removeCategory(): void {
    this.selectedCategory = null;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    // Verifică dacă a fost selectat un fișier
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Transformă imaginea în Base64
        const base64Image = e.target.result;

        // Setează codul Base64 în câmpul 'picture' al formularului
        this.ingredientForm.get('picture')?.setValue(base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  onSaveClick(): void {
    if (this.ingredientForm.valid) {
      let formData = this.ingredientForm.value;
      formData.categoryId = formData.selectedCategory;
      // Add any additional logic to handle form data as needed
      this.dialogRef.close(formData);
    }
  }
}
