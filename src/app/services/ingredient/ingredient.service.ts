import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getIngredients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ingredient/`);
  }

  // getIngredients(options: any): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Ingredient`, { params: options });
  // }

  getIngredientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ingredient/${id}`);
  }

  addIngredient(ingredient: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Ingredient`, ingredient);
  }

  updateIngredient(id: number, ingredient: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Ingredient/${id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Ingredient/${id}`);
  }

  getAllIngredientQuantitiessPaginated(options: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/IngredientQuantities`, {
      params: options,
    });
  }

  getIngredientQuantitiesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/IngredientQuantities/${id}`);
  }

  addIngredientQuantities(ingredientQuantities: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/IngredientQuantities`,
      ingredientQuantities
    );
  }

  updateIngredientQuantities(
    id: number,
    ingredientQuantities: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/IngredientQuantities/${id}`,
      ingredientQuantities
    );
  }

  deleteIngredientQuantities(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/IngredientQuantities/${id}`);
  }
}
