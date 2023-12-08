import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserAuth } from 'src/app/models/IUserAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) {}

  login(user: IUserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/login`, user).pipe(
      tap((response: { token: string }) => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  register(user: IUserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/register`, user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null; // Checks if token exists
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User`);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/${userId}`);
  }

  changeUserRole(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/change-role/${userId}`, {});
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/delete/${userId}`);
  }

  updateEmail(userId: string, newEmail: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/User/update-email/${userId}`,
      newEmail
    );
  }

  updatePassword(userId: string, model: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/User/update-password/${userId}`,
      model
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/forgot-password`, email);
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/User/reset-password/${email}/${token}`,
      newPassword
    );
  }
}
