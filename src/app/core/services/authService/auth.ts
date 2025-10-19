import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/users';

// Strict roles we actually support in routing/guards:
export type AppRole = 'admin' | 'organizer' | 'guest';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'users';
  private guestAccountsKey = 'userGuests';
  private loggedKey = 'loggedUser';

  constructor(private router: Router) {
    this.runStorageMigration();
  }

  private normalizeRole(r: string | undefined | null): AppRole {
    const v = (r ?? '').toLowerCase().trim();
    if (v === 'admin' || v === 'organizer' || v === 'guest') return v;
    return 'guest';
  }

  encryptText(text: string): string {
    if (!text) return '';
    const reversed = text.split('').reverse().join('');
    let swapped = '';
    for (let i = 0; i < reversed.length; i += 2) {
      swapped += reversed[i + 1] ? reversed[i + 1] + reversed[i] : reversed[i];
    }
    let shifted = '';
    for (const c of swapped) shifted += String.fromCharCode(c.charCodeAt(0) + 3);
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + shifted + suffix;
  }

  decryptText(text: string): string {
    if (!text) return '';
    const inner = text.substring(1, text.length - 1);
    let shifted = '';
    for (const c of inner) shifted += String.fromCharCode(c.charCodeAt(0) - 3);
    let swapped = '';
    for (let i = 0; i < shifted.length; i += 2) {
      swapped += shifted[i + 1] ? shifted[i + 1] + shifted[i] : shifted[i];
    }
    return swapped.split('').reverse().join('');
  }

  registerUser(userData: Omit<User, 'id'>): boolean {
    const email = (userData.email ?? '').toLowerCase().trim();
    const role: AppRole = this.normalizeRole(userData.role);
    const key = role === 'guest' ? this.guestAccountsKey : this.usersKey;

    const users: User[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (users.some((u) => (u.email ?? '').toLowerCase() === email)) return false;

    const newUser: User = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      ...userData,
      email,
      role,
      password: this.encryptText(userData.password),
    };

    users.push(newUser);
    localStorage.setItem(key, JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const e = (email ?? '').toLowerCase().trim();

    const staff: User[]  = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const guests: User[] = JSON.parse(localStorage.getItem(this.guestAccountsKey) || '[]');

    const all: User[] = [...staff, ...guests].map(u => ({ ...u, role: this.normalizeRole(u.role) }));

    const user = all.find(
      (u) => (u.email ?? '').toLowerCase() === e && this.decryptText(u.password) === password
    );

    if (user) {
      localStorage.setItem(this.loggedKey, JSON.stringify(user));
      return true;
    }
    return false;
  }
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
  getAllUsers(): User[] {
    const staff: User[]  = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const guests: User[] = JSON.parse(localStorage.getItem(this.guestAccountsKey) || '[]');
    return [...staff, ...guests].map(u => ({ ...u, role: this.normalizeRole(u.role) }));
  }

  getLoggedUser(): User | null {
    const u = JSON.parse(localStorage.getItem(this.loggedKey) || 'null') as User | null;
    return u ? { ...u, role: this.normalizeRole(u.role) } : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.loggedKey);
  }

  hasRole(...roles: AppRole[]): boolean {
    const u = this.getLoggedUser();
    return !!u && roles.includes(this.normalizeRole(u.role));
  }

  logout() {
    localStorage.removeItem(this.loggedKey);
    this.router.navigate(['/login']);
  }

  private runStorageMigration() {
    try {
      const rawGuests = localStorage.getItem('guests');
      if (!rawGuests) return;

      const parsed = JSON.parse(rawGuests);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const userShape = (x: any) =>
        typeof x === 'object' && x && 'password' in x && 'role' in x && !('eventId' in x);

      const misplacedUsers: any[] = [];
      const trueAttendees: any[] = [];

      for (const item of parsed) {
        if (userShape(item)) misplacedUsers.push(item);
        else trueAttendees.push(item);
      }

      if (misplacedUsers.length > 0) {
        const existingGuestAccounts: User[] = JSON.parse(localStorage.getItem(this.guestAccountsKey) || '[]');
        const merged = [...existingGuestAccounts];

        for (const u of misplacedUsers) {
          const email = (u.email ?? '').toLowerCase();
          if (!merged.some(m => (m.email ?? '').toLowerCase() === email)) {
            merged.push({ ...u, role: this.normalizeRole(u.role) });
          }
        }

        localStorage.setItem(this.guestAccountsKey, JSON.stringify(merged));
        localStorage.setItem('guests', JSON.stringify(trueAttendees));
      }
    } catch {
      // ignore migration errors
    }
  }
}
