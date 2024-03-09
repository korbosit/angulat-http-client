import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { LoaderComponent } from '../utility/loader/loader.component';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';

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
      return;
    } else {
      // signup logic
      this.isLoading = true;
      this.authService.signup(email, password).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
        },
        error: (errMsg) => {
          this.isLoading = false;
          // this.errorMessage = err.message;
          this.errorMessage = errMsg;
          this.hideSnackbar();
        },
      });
    }
    form.reset();
  }

  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
