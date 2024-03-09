import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  signup(email, password) {
    // see firebase docs https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxiWsvz9jVbe4fhiq9dKxNXaaTd4Qfy98',
      data
    );
  }
}
