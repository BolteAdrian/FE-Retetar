import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getRecipes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/`);
  }

  // getRecipes(options: any): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Recipe`, { params: options });
  // }

  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Recipe/${id}`);
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

  submitAmount(id: number, qty : number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recipe/${id}/submit-amount`,qty);
  }


  deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Recipe/${id}`);
  }
}
