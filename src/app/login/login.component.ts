import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode: boolean = true;

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
      this.authService.signup(email, password).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
    form.reset();
  }
}
