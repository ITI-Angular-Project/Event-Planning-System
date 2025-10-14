import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter both email and password.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'Invalid email format.';
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const success = this.authService.login(this.email.trim().toLowerCase(), this.password);
      this.isLoading = false;

      if (success) {
        this.successMsg = 'Login successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      } else {
        this.errorMsg = 'Incorrect email or password.';
      }
    }, 1000);
  }
}
  