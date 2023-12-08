import { Component } from '@angular/core';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent {
  ingredients: any[] = [];

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(
      (response: any) => {
        console.log(response);
        // Manipulează datele primite aici
        this.ingredients = response.ingredients;
      },
      (error: any) => {
        // Gestionează erorile aici
        console.error(error);
      }
    );
  }
}
