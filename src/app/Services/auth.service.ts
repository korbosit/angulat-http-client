import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { Subject, catchError, tap, throwError } from 'rxjs';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  // error: string | null = null;
  user = new Subject<User>();
  signup(email, password) {
    // see firebase docs https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxiWsvz9jVbe4fhiq9dKxNXaaTd4Qfy98',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  login(email, password) {
    // see firebase docs https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxiWsvz9jVbe4fhiq9dKxNXaaTd4Qfy98',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  private handleCreateUser(res) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    const user = new User(res.email, res.localId, res.idToken, expiresIn);
    this.user.next(user);
  }
  private handleError(err) {
    let errorMessage = 'An unknown error has occured';
    console.log(err);
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exist';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'This operation is not allowed';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          ' We have blocked all requests from this device due to unusual activity. Try again later';
        break;
      // case 'EMAIL_NOT_FOUND':
      //   errorMessage = ' This email does not exist';
      //   break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = ' The email ID or Password is not correct';
        break;
      // case 'INVALID_PASSWORD':
      //   errorMessage = ' Provided password is incorrect';
      //   break;
      case 'USER_DISABLED':
        errorMessage =
          ' The user account has been disabled by an administrator.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
