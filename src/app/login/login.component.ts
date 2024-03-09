import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode: boolean = true;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmitted(form: NgForm) {
    console.log(form.value);
    form.reset();
  }
}
