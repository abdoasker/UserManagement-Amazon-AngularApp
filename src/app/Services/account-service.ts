import { RegisterDTO } from '../Models/register-dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { User } from '../Models/user.js';
import { LoginDTO } from '../Models/login-dto.js';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _currentUserName = new BehaviorSubject<string | null>(null);
  currentUserName$ = this._currentUserName.asObservable();

  private _currentUserRole = new BehaviorSubject<string | null>(null);
  currentUserRole$ = this._currentUserRole.asObservable();

  setUserName(name: string | null) {
    this._currentUserName.next(name);
  }
  setUserRole(name: string | null) {
    this._currentUserRole.next(name);
  }

  constructor(private _http: HttpClient) {}
  AccountURL = 'https://localhost:7215/api/v1/Account';

  checkEmailExists(email: string): Observable<boolean> {
    return this._http.get<boolean>(
      `${this.AccountURL}/register/check-email?email=${encodeURIComponent(
        email
      )}`
    );
  }

  Registeration(registerDTO: RegisterDTO) {
    return this._http
      .post<User>(`${this.AccountURL}/Register`, registerDTO)
      .pipe(
        catchError((err) => {
          console.error(err);
          return of(err); // return empty list on error
        })
      );
  }

  generateNewToken(): Observable<any> {
    var token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    var refreshToken =
      localStorage.getItem('refreshToken') ||
      sessionStorage.getItem('refreshToken');
    return this._http.post<any>(`${this.AccountURL}/generate-new-token`, {
      token: token,
      refreshToken: refreshToken,
    });
  }

  /** Ensure we have a valid (not expired) access token */
  async getValidAccessToken(): Promise<string> {
    let token = this.getAccessToken();

    if (!token || this.isTokenExpired(token)) {
      try {
        const result = await this.generateNewToken().toPromise(); // convert observable to promise
        if (result && result.token) {
          // store new tokens
          localStorage.setItem('token', result.token);
          if (result.refreshToken) {
            localStorage.setItem('refreshToken', result.refreshToken);
          }
          token = result.token;
        }
      } catch (err) {
        console.error('Failed to refresh token:', err);
        token = ''; // force empty to let hub fail
      }
    }

    return token || '';
  }

  /** Simple JWT exp check */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() > expiry;
    } catch (e) {
      return true; // invalid token → treat as expired
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  Login(loginDTO: LoginDTO) {
    return this._http.post<User>(`${this.AccountURL}/Login`, loginDTO).pipe(
      catchError((err) => {
        console.error(err);
        return of(err); // return empty list on error
      })
    );
  }
  LogOut() {
    return this._http.get(`${this.AccountURL}/logout`).pipe(
      catchError((err) => {
        console.error(err);
        return of(err); // return empty list on error
      })
    );
  }
  /** Start Google OAuth flow - backend will redirect to Google */
  startGoogleSignIn() {
    // Use full page redirect so cookies are preserved for external provider handshake
    window.location.href = `${this.AccountURL}/google-signin`;
  }
  ResetPassConfirm(email: string) {
    return this._http.post(`${this.AccountURL}/reset-password`, { email }).pipe(
      catchError((err) => {
        console.error(err);
        return of(err); // return empty list on error
      })
    );
  }
  confirmResetPassword(model: {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this._http.post(`${this.AccountURL}/confirm-reset-password`, model);
  }
}
