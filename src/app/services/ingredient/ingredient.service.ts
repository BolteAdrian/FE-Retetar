import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IIngredintQuantity } from 'src/app/models/IIngredientQuantity';
import { IIngredint } from 'src/app/models/IIngredint';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * METHOD GET
   * Fetches all ingredients.
   * @returns {Observable<any>} - An observable containing the list of ingredients.
   */
  getIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ingredient/`);
  }

  /**
   * METHOD POST
   * Fetches all ingredients with pagination and filtering options.
   * @param {ISearchOptions} options - The search options for pagination and filtering.
   * @returns {Observable<any>} - An observable containing the paginated list of ingredients.
   */
  getIngredientsPaginated(options: ISearchOptions): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Ingredient/search`, options);
  }

  /**
   * METHOD GET
   * Fetches ingredients by category ID.
   * @param {number} id - The ID of the category.
   * @returns {Observable<any>} - An observable containing the list of ingredients for the specified category.
   */
  getIngredientsByCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ingredient/category/${id}`);
  }

  /**
   * METHOD GET
   * Fetches an ingredient by its ID.
   * @param {number} id - The ID of the ingredient.
   * @returns {Observable<any>} - An observable containing the ingredient data.
   */
  getIngredientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ingredient/${id}`);
  }

  /**
   * METHOD POST
   * Adds a new ingredient.
   * @param {IIngredint} ingredient - The ingredient data to add.
   * @returns {Observable<any>} - An observable containing the response.
   */
  addIngredient(ingredient: IIngredint): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Ingredient`, ingredient);
  }

  /**
   * METHOD PUT
   * Updates an existing ingredient by its ID.
   * @param {number} id - The ID of the ingredient to update.
   * @param {IIngredint} ingredient - The new ingredient data.
   * @returns {Observable<any>} - An observable containing the response.
   */
  updateIngredient(id: number, ingredient: IIngredint): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Ingredient/${id}`, ingredient);
  }

  /**
   * METHOD DELETE
   * Deletes an ingredient by its ID.
   * @param {number} id - The ID of the ingredient to delete.
   * @returns {Observable<any>} - An observable containing the response.
   */
  deleteIngredient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Ingredient/${id}`);
  }

  /**
   * METHOD POST
   * Fetches all ingredient quantities with pagination and filtering options.
   * @param {ISearchOptions} options - The search options for pagination and filtering.
   * @returns {Observable<any>} - An observable containing the paginated list of ingredient quantities.
   */
  getAllIngredientQuantitiesPaginated(
    options: ISearchOptions
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/IngredientQuantities`, {
      options,
    });
  }

  /**
   * METHOD GET
   * Fetches all quantities for a specific ingredient.
   * @param {number} ingredientId - The ID of the ingredient.
   * @returns {Observable<any>} - An observable containing the list of quantities for the ingredient.
   */
  getAllQuantities(ingredientId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/IngredientQuantities/all/${ingredientId}`
    );
  }

  /**
   * METHOD GET
   * Fetches ingredient quantities by their ID.
   * @param {number} id - The ID of the ingredient quantity.
   * @returns {Observable<any>} - An observable containing the ingredient quantity data.
   */
  getIngredientQuantitiesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/IngredientQuantities/${id}`);
  }

  /**
   * METHOD POST
   * Adds a new ingredient quantity.
   * @param {IIngredintQuantity} ingredientQuantities - The ingredient quantity data to add.
   * @returns {Observable<any>} - An observable containing the response.
   */
  addIngredientQuantities(
    ingredientQuantities: IIngredintQuantity
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/IngredientQuantities`,
      ingredientQuantities
    );
  }

  /**
   * METHOD POST
   * Imports multiple ingredient quantities.
   * @param {IIngredintQuantity[]} ingredientQuantities - The array of ingredient quantities to import.
   * @returns {Observable<any>} - An observable containing the response.
   */
  importIngredientQuantities(
    ingredientQuantities: IIngredintQuantity[]
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/IngredientQuantities/import`,
      ingredientQuantities
    );
  }

  /**
   * METHOD PUT
   * Updates an existing ingredient quantity by its ID.
   * @param {number} id - The ID of the ingredient quantity to update.
   * @param {IIngredintQuantity} ingredientQuantities - The new ingredient quantity data.
   * @returns {Observable<any>} - An observable containing the response.
   */
  updateIngredientQuantities(
    id: number,
    ingredientQuantities: IIngredintQuantity
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/IngredientQuantities/${id}`,
      ingredientQuantities
    );
  }

  /**
   * METHOD DELETE
   * Deletes an ingredient quantity by its ID.
   * @param {number} id - The ID of the ingredient quantity to delete.
   * @returns {Observable<any>} - An observable containing the response.
   */
  deleteIngredientQuantities(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/IngredientQuantities/${id}`);
  }
}
