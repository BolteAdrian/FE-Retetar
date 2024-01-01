import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Category/`);
  }

  // getAllCategoriesPaginated(options: any): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Category`, { params: options });
  // }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Category/${id}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Category`, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Category/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Category/${id}`);
  }
}
