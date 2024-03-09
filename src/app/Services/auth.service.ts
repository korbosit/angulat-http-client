import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  error: string | null = null;
  signup(email, password) {
    // see firebase docs https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxiWsvz9jVbe4fhiq9dKxNXaaTd4Qfy98',
        data
      )
      .pipe(
        catchError((err) => {
          let errorMessage = 'An unknown error has occured';
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
          }
          return throwError(() => errorMessage);
        })
      );
  }
}
