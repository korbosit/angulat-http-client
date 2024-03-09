import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { LoaderComponent } from '../utility/loader/loader.component';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoaderComponent, CommonModule, SnackbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  authObs: Observable<AuthResponse>;
  router: Router = inject(Router);

  authService: AuthService = inject(AuthService);

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmitted(form: NgForm) {
    // console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLoginMode) {
      // login logic
      this.isLoading = true;
      this.authObs = this.authService.login(email, password);
    } else {
      // signup logic
      this.isLoading = true;
      this.authObs = this.authService.signup(email, password);
    }

    this.authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (errMsg) => {
        this.isLoading = false;
        this.errorMessage = errMsg;

        this.hideSnackbar();
      },
    });

    form.reset();
  }

  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
