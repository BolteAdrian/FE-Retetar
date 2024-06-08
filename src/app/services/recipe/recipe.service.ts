import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  // HTTP headers for JSON content
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  /**
   * METHOD GET
   * Fetches recipes by category ID.
   * @param {number} id - The ID of the category.
   * @returns {Observable<any>} - An observable containing the list of recipes for the specified category.
   */
  getRecipesByCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/category/${id}`);
  }

  /**
   * METHOD POST
   * Fetches recipes with pagination and filtering options.
   * @param {ISearchOptions} options - The search options for pagination and filtering.
   * @returns {Observable<any>} - An observable containing the paginated list of recipes.
   */
  getRecipes(options: ISearchOptions): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recipe/search`, options);
  }

  /**
   * METHOD GET
   * Fetches recipe details by its ID.
   * @param {number} id - The ID of the recipe.
   * @returns {Observable<any>} - An observable containing the recipe details.
   */
  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/${id}`);
  }

  /**
   * METHOD GET
   * Fetches prepared recipes and their ingredients.
   * @returns {Observable<any>} - An observable containing the prepared recipes and their ingredients.
   */
  getPreparedRecipesAndIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/prepared-recipes`);
  }

  /**
   * METHOD GET
   * Fetches a prediction for recipe consumption.
   * @returns {Observable<any>} - An observable containing the prediction for recipe consumption.
   */
  getPrediction(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/prediction-consume`);
  }

  /**
   * METHOD POST
   * Adds a new recipe.
   * @param {any} recipe - The recipe data to add.
   * @returns {Observable<any>} - An observable containing the response.
   */
  addRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recipe`, recipe);
  }

  /**
   * METHOD PUT
   * Updates an existing recipe by its ID.
   * @param {number} id - The ID of the recipe to update.
   * @param {any} recipe - The new recipe data.
   * @returns {Observable<any>} - An observable containing the response.
   */
  updateRecipe(id: number, recipe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Recipe/${id}`, recipe);
  }

  /**
   * METHOD GET
   * Fetches the maximum amount of a recipe by its ID.
   * @param {number} id - The ID of the recipe.
   * @returns {Observable<any>} - An observable containing the maximum amount of the recipe.
   */
  maxAmount(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/${id}/amount`);
  }

  /**
   * METHOD POST
   * Submits the amount for a recipe by its ID.
   * @param {number} id - The ID of the recipe.
   * @param {number} qty - The quantity to submit.
   * @returns {Observable<any>} - An observable containing the response.
   */
  submitAmount(id: number, qty: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Recipe/${id}/submit-amount`,
      qty,
      this.httpOptions
    );
  }

  /**
   * METHOD DELETE
   * Deletes a recipe by its ID.
   * @param {number} id - The ID of the recipe to delete.
   * @returns {Observable<any>} - An observable containing the response.
   */
  deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Recipe/${id}`);
  }
}
