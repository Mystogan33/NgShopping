import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface AuthRequestData {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http : HttpClient,
    private router: Router
  ) { }

  signUp(email: string, password: string): Observable<AuthResponseData | string> {

    let requestBody : AuthRequestData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      requestBody
    )
    .pipe(
      catchError(this.handleError),
      tap(this.handleAuthentification.bind(this))
    )
  };

  login(email: string, password: string) : Observable<AuthResponseData | string> {
    let requestBody: AuthRequestData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      requestBody
    )
    .pipe(
      catchError(this.handleError),
      tap(this.handleAuthentification.bind(this))
    )
  };

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token) {
      this.user$.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logOut(), expirationDuration);
  }

  logOut() {
    this.user$.next(null);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/auth']);
  }


  private handleAuthentification(resData : AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + (+resData.expiresIn * 1000)
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken, expirationDate
    );
    this.user$.next(user);
    this.autoLogout(+resData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  };

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";

    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    } else {
      switch(errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = "This email exists already";
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = "No account registered with this email."
          break;
        case 'INVALID_PASSWORD':
          errorMessage = "Invalid password."
          break;
        default:
      }
      return throwError(errorMessage);
    }
  };

}
