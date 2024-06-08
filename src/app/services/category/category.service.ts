import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/models/ICategory';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * METHOD GET
   * Fetches all categories.
   * @returns {Observable<any>} - An observable containing the list of categories.
   */
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Category/`);
  }

  /**
   * METHOD GET
   * Fetches categories by type.
   * @param {boolean} isRecipe - The type of categories to fetch (true for recipe categories, false for other types).
   * @returns {Observable<any>} - An observable containing the list of categories by type.
   */
  getCategoriesByType(isRecipe: boolean): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Category/type/${isRecipe}`);
  }

  /**
   * METHOD POST
   * Fetches all categories with pagination options.
   * @param {ISearchOptions} options - The search options for pagination and filtering.
   * @returns {Observable<any>} - An observable containing the paginated list of categories.
   */
  getAllCategoriesPaginated(options: ISearchOptions): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Category/search`, options);
  }

  /**
   * METHOD GET
   * Fetches a category by its ID.
   * @param {number} id - The ID of the category to fetch.
   * @returns {Observable<any>} - An observable containing the category data.
   */
  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Category/${id}`);
  }

  /**
   * METHOD POST
   * Adds a new category.
   * @param {ICategory} category - The category data to add.
   * @returns {Observable<any>} - An observable containing the response.
   */
  addCategory(category: ICategory): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Category`, category);
  }

  /**
   * METHOD PUT
   * Updates an existing category.
   * @param {number} id - The ID of the category to update.
   * @param {ICategory} category - The new category data.
   * @returns {Observable<any>} - An observable containing the response.
   */
  updateCategory(id: number, category: ICategory): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Category/${id}`, category);
  }

  /**
   * METHOD DELETE
   * Deletes a category by its ID.
   * @param {number} id - The ID of the category to delete.
   * @returns {Observable<any>} - An observable containing the response.
   */
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Category/${id}`);
  }
}
