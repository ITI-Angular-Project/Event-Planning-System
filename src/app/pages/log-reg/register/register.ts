import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
=======
import { Router, RouterLink } from '@angular/router';
>>>>>>> 8bf8bbaeca9e4fd275861afc10520be61635adda
import { AuthService, User } from '../../../core/services/authService/auth';

@Component({
  selector: 'app-register',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
=======
  imports: [CommonModule, FormsModule, RouterLink],
>>>>>>> 8bf8bbaeca9e4fd275861afc10520be61635adda
  templateUrl: './register.html',
  styleUrls: ['./register.css']
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
      phone: this.phone,
      password: this.password,
      role: this.role
    };

    this.isLoading = true;

    setTimeout(() => {
      const success = this.authService.registerUser(newUser);
      this.isLoading = false;

      if (success) {
        this.successMsg = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.errorMsg = 'This email is already registered.';
      }
    }, 1000);
  }
}
