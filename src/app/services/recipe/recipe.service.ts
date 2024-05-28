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
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', // Specifică tipul de media ca JSON
    }),
  };
  constructor(private http: HttpClient) {}

  getRecipesByCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/category/${id}`);
  }

  getRecipes(options: ISearchOptions): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recipe/search`, options);
  }

  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/${id}`);
  }

  getPreparedRecipesAndIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/prepared-recipes`);
  }

  getPrediction() {
    return this.http.get<any>(`${this.apiUrl}/Recipe/prediction-consume`);
  }

  addRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recipe`, recipe);
  }

  updateRecipe(id: number, recipe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Recipe/${id}`, recipe);
  }

  maxAmount(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/${id}/amount`);
  }

  submitAmount(id: number, qty: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Recipe/${id}/submit-amount`,
      qty,
      this.httpOptions
    );
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Recipe/${id}`);
  }
}
