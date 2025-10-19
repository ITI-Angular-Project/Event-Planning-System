import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth';
import { Loader } from "../../../shared/components/loader/loader";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Loader],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  isLoading = false;
  // Forgot password modal state
  showForgotModal = false;
  fpEmail = '';
  fpNewPassword = '';
  fpConfirmPassword = '';
  fpMsg = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

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
        const success = this.authService.login(
          this.email.trim().toLowerCase(),
          this.password.trim()
        );
        this.isLoading = false;

        if (success) {
          const loggedUser = this.authService.getLoggedUser();
          if (!loggedUser) {
            this.errorMsg = 'Login failed: user not found.';
            return;
          }

          this.successMsg = '✅ Login successful! Redirecting...';
          setTimeout(() => {
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            if (returnUrl) {
              // preserve full path with query
              this.router.navigateByUrl(returnUrl);
              return;
            }

            const role = (loggedUser.role || '').toLowerCase();
            if (role === 'admin' || role === 'organizer') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          }, 300);
        } else {
          this.errorMsg = '❌ Incorrect email or password.';
        }
      }, 200);
    } catch (err) {
      console.error('Login error:', err);
      this.isLoading = false;
      this.errorMsg = 'Unexpected error occurred during login.';
    }
  }

  openForgotModal() {
    this.fpEmail = '';
    this.fpNewPassword = '';
    this.fpConfirmPassword = '';
    this.fpMsg = '';
    this.showForgotModal = true;
  }

  closeForgotModal() {
    this.showForgotModal = false;
  }

  resetPassword() {
    this.fpMsg = '';
    const email = (this.fpEmail || '').trim().toLowerCase();
    if (!email) {
      this.fpMsg = 'Please enter your email.';
      return;
    }
    if (!this.fpNewPassword || !this.fpConfirmPassword) {
      this.fpMsg = 'Please enter and confirm your new password.';
      return;
    }
    if (this.fpNewPassword !== this.fpConfirmPassword) {
      this.fpMsg = 'Passwords do not match.';
      return;
    }

    // try to find the user in users or guests
    const usersKey = 'users';
    const guestsKey = 'guests';
    const users: any[] = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const guests: any[] = JSON.parse(localStorage.getItem(guestsKey) || '[]');

    const idxUser = users.findIndex((u) => u.email === email);
    const idxGuest = guests.findIndex((g) => g.email === email);

    if (idxUser === -1 && idxGuest === -1) {
      this.fpMsg = 'No account found with that email.';
      return;
    }

    const newEncrypted = this.authService.encryptText(this.fpNewPassword);

    if (idxUser !== -1) {
      users[idxUser].password = newEncrypted;
      localStorage.setItem(usersKey, JSON.stringify(users));
    }
    if (idxGuest !== -1) {
      guests[idxGuest].password = newEncrypted;
      localStorage.setItem(guestsKey, JSON.stringify(guests));
    }

    this.fpMsg = 'Password updated successfully. You can now login with your new password.';
    setTimeout(() => {
      this.closeForgotModal();
    }, 1400);
  }
}
