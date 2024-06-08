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

  /**
   * METHOD POST
   * Authenticates the user and stores the authentication token.
   * @param {IUserAuth} user - The user credentials.
   * @returns {Observable<any>} - An observable containing the authentication response.
   */
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

  /**
   * METHOD POST
   * Registers a new user.
   * @param {IUserAuth} user - The user registration data.
   * @returns {Observable<any>} - An observable containing the registration response.
   */
  register(user: IUserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/register`, user);
  }

  /**
   * METHOD POST
   * Sends an email with an attachment.
   * @param {FormData} emailData - The email data containing the attachment.
   * @returns {Observable<any>} - An observable containing the response.
   */
  sendEmailWithAttachment(emailData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/User/email`, emailData);
  }

  /**
   * METHOD GET
   * Fetches user settings.
   * @returns {Observable<any>} - An observable containing the user settings.
   */
  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/settings`);
  }

  /**
   * METHOD PUT
   * Updates user settings.
   * @param {FormGroup} settings - The user settings to update.
   * @returns {Observable<any>} - An observable containing the response.
   */
  setSettings(settings: FormGroup): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/User/settings`, settings);
  }

  /**
   * METHOD LOGOUT
   * Logs out the user by removing authentication tokens from local storage.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME);
    localStorage.removeItem(this.USER_ID);
  }

  /**
   * METHOD GET
   * Retrieves the authentication token from local storage.
   * @returns {string | null} - The authentication token or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * METHOD CHECK
   * Checks if the user is authenticated.
   * @returns {boolean} - True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * METHOD GET
   * Fetches all users.
   * @returns {Observable<any>} - An observable containing the list of users.
   */
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User`);
  }

  /**
   * METHOD GET
   * Fetches a user by their ID.
   * @param {string} userId - The ID of the user to fetch.
   * @returns {Observable<any>} - An observable containing the user data.
   */
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/${userId}`);
  }

  /**
   * METHOD POST
   * Changes the role of the current user.
   * @returns {Observable<any>} - An observable containing the response.
   */
  changeUserRole(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/User/change-role/${localStorage.getItem(this.USER_ID)}`,
      {}
    );
  }

  /**
   * METHOD DELETE
   * Deletes a user account by their ID.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Observable<any>} - An observable containing the response.
   */
  deleteAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/delete/${userId}`);
  }

  /**
   * METHOD PUT
   * Updates the email of the current user.
   * @param {string} newEmail - The new email address.
   * @returns {Observable<any>} - An observable containing the response.
   */
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

  /**
   * METHOD PUT
   * Updates the password of the current user.
   * @param {any} data - The data containing the new password.
   * @returns {Observable<any>} - An observable containing the response.
   */
  updatePassword(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/User/update-password/${localStorage.getItem(
        this.USER_ID
      )}`,
      data
    );
  }

  /**
   * METHOD POST
   * Initiates the forgot password process by sending a reset email.
   * @param {string} email - The email address to send the reset email to.
   * @returns {Observable<any>} - An observable containing the response.
   */
  forgotPassword(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post<any>(`${this.apiUrl}/User/forgot-password`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * METHOD POST
   * Resets the password using a token sent to the user's email.
   * @param {string} email - The email address of the user.
   * @param {string} token - The token for resetting the password.
   * @param {string} newPassword - The new password to set.
   * @returns {Observable<any>} - An observable containing the response.
   */
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
