import { Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/services/themeService/theme-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/authService/auth';
import { DataService } from '../../../core/services/dataService/data-service';
import { User } from '../../../core/models/users';
import { ToastService } from '../../../core/services/toastService/toast-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);

  theme = computed(() => this.themeService.theme());
  user = signal<User>(this.authService.getLoggedUser()!);

  editMode = false;

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  updateField<K extends keyof User>(field: K, value: User[K]) {
    this.user.update(u => ({ ...u, [field]: value }));
  }

  saveProfile() {
    const updatedUser = this.user();

    this.dataService.updateSingleUser(updatedUser);

    localStorage.setItem('loggedUser', JSON.stringify(updatedUser));

    this.editMode = false;
    this.toastService?.show('success', 'Profile updated successfully!');
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
