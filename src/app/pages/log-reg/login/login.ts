import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  // ===== Basic Validation =====
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

  try {
    setTimeout(() => {
      const success = this.authService.login(this.email.trim().toLowerCase(), this.password.trim());
      this.isLoading = false;

      if (success) {
        const loggedUser = this.authService.getLoggedUser();

        if (!loggedUser) {
          this.errorMsg = 'Login failed: user not found.';
          return;
        }

        this.successMsg = '✅ Login successful! Redirecting...';
        console.log('Logged User:', loggedUser);

        // redirect based on role
        setTimeout(() => {
          if (loggedUser.role === 'guest') {
            this.router.navigate(['/home']);
          } else if (loggedUser.role === 'organizer') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1200);

      } else {
        this.errorMsg = '❌ Incorrect email or password.';
      }
    }, 800);
  } catch (err) {
    console.error('Login error:', err);
    this.isLoading = false;
    this.errorMsg = 'Unexpected error occurred during login.';
  }
}
}
