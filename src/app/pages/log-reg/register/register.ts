import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth';
import { User } from '../../../core/models/users';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  role = 'organizer';
  errorMsg = '';
  successMsg = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.name || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'Invalid email address.';
      return;
    }

    if (!/^01[0-9]{9}$/.test(this.phone)) {
      this.errorMsg = 'Phone number must start with 01 and contain 11 digits.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    const newUser: Omit<User, 'id'> = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone.trim(),
      password: this.password.trim(),
      role: (this.role || 'guest').toLowerCase(), // normalized later in AuthService
    };

    this.isLoading = true;

    try {
      setTimeout(() => {
        const success = this.authService.registerUser(newUser);
        this.isLoading = false;

        if (success) {
          this.successMsg = '✅ Account created successfully! Redirecting to login...';

          //  اختبار سريع: اطبع في الكونسول
          // console.log('Registered user:', newUser);
          // console.log('LocalStorage guests:', localStorage.getItem('guests'));
          // console.log('LocalStorage users:', localStorage.getItem('users'));

          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMsg = '⚠️ This email is already registered.';
        }
      }, 800);
    } catch (err) {
      console.error('Registration error:', err);
      this.isLoading = false;
      this.errorMsg = 'Unexpected error occurred during registration.';
    }
  }
}
