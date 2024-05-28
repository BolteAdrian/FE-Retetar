import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserAuth } from 'src/app/models/IUserAuth';
import { IJwtAutResponse } from 'src/app/models/IJwtAutResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_NAME = 'username';
  private readonly USER_ID = 'userid';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(user: IUserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/login`, user).pipe(
      tap((response: IJwtAutResponse) => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_NAME, response.userName);
          localStorage.setItem(this.USER_ID, response.id);
        }
      })
    );
  }

  register(user: IUserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/register`, user);
  }

  sendEmailWithAttachment(emailData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/email`, emailData);
  }

  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/settings`);
  }

  setSettings(settings: FormGroup): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/User/settings`, settings);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME);
    localStorage.removeItem(this.USER_ID);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User`);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/${userId}`);
  }

  changeUserRole(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/User/change-role/${localStorage.getItem(this.USER_ID)}`,
      {}
    );
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/delete/${userId}`);
  }

  updateEmail(newEmail: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<any>(
      `${this.apiUrl}/User/update-email/${localStorage.getItem(this.USER_ID)}`,
      JSON.stringify(newEmail),
      options
    );
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/User/update-password/${localStorage.getItem(
        this.USER_ID
      )}`,
      data
    );
  }

  forgotPassword(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post<any>(`${this.apiUrl}/User/forgot-password`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<any> {
    const body = { email: email, newPassword: newPassword };
    return this.http.post<any>(
      `${this.apiUrl}/User/reset-password/${token}`,
      body
    );
  }
}
