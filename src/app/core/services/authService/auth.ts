import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private loggedKey = 'loggedUser';

  constructor(private router: Router) {}

  // ===== Encryption & Decryption =====
  encryptText(text: string): string {
    if (!text) return '';
    const reversed = text.split('').reverse().join('');
    let swapped = '';
    for (let i = 0; i < reversed.length; i += 2) {
      swapped += reversed[i + 1] ? reversed[i + 1] + reversed[i] : reversed[i];
    }
    let shifted = '';
    for (let c of swapped) shifted += String.fromCharCode(c.charCodeAt(0) + 3);
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + shifted + suffix;
  }

  decryptText(text: string): string {
    if (!text) return '';
    let inner = text.substring(1, text.length - 1);
    let shifted = '';
    for (let c of inner) shifted += String.fromCharCode(c.charCodeAt(0) - 3);
    let swapped = '';
    for (let i = 0; i < shifted.length; i += 2) {
      swapped += shifted[i + 1] ? shifted[i + 1] + shifted[i] : shifted[i];
    }
    return swapped.split('').reverse().join('');
  }

  // ===== User Register =====
registerUser(userData: Omit<User, 'id'>): boolean {
  const key = userData.role === 'guest' ? 'guests' : 'users';
  const users: User[] = JSON.parse(localStorage.getItem(key) || '[]');

  if (users.some((u) => u.email === userData.email)) {
    return false;
  }

  const newUser: User = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...userData,
    password: this.encryptText(userData.password),
  };

  users.push(newUser);
  localStorage.setItem(key, JSON.stringify(users));
  return true;
}

// ===== Login =====
login(email: string, password: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');

  const allUsers = [...users, ...guests];

  const user = allUsers.find(
    (u) => u.email === email && this.decryptText(u.password) === password
  );

  if (user) {
    localStorage.setItem(this.loggedKey, JSON.stringify(user));
    return true;
  }

  return false;
}



  // ===== Helpers =====
  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  getLoggedUser(): User | null {
    return JSON.parse(localStorage.getItem(this.loggedKey) || 'null');
  }

  logout() {
    localStorage.removeItem(this.loggedKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.loggedKey);
  }
}
