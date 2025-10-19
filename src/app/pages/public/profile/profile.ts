// pages/public/profile/profile.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth';
import { DataService } from '../../../core/services/dataService/data-service';
import { User } from '../../../core/models/users';
import { Guest } from '../../../core/models/guests';

type Row = {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
  rsvp: Guest['status'];
  inviteToken?: string;
  canFeedback: boolean;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private data = inject(DataService);
  private router = inject(Router);

  saving = signal(false);
  saveMsg = signal<string | null>(null);
  errorMsg = signal<string | null>(null);
  showPassword = signal(false);
  changePassword = signal(false);

  name = signal('');
  email = signal('');
  phone = signal('');
  password = signal('');
  user = signal<User | null>(null);
  rows = signal<Row[]>([]);

  ngOnInit(): void {
    const u = this.auth.getLoggedUser();
    if (!u) {
      this.router.navigate(['/login']);
      return;
    }
    if (u.role !== 'guest') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.user.set(u);
    this.name.set(u.name || '');
    this.email.set(u.email || '');
    this.phone.set(u.phone || '');
    this.buildRows();
  }

  private buildRows() {
    const u = this.user();
    if (!u?.email) {
      this.rows.set([]);
      return;
    }

    const guests = this.data.guests();
    const events = this.data.events();
    const myEntries = guests.filter(
      (g) => (g.email ?? '').toLowerCase() === u.email!.toLowerCase()
    );

    const rows: Row[] = myEntries.map((g) => {
      const ev = events.find((e) => e.id === g.eventId);
      const endedByDate = ev ? new Date(ev.endDate) < new Date() : false;
      const endedByStatus = (ev?.status ?? '').toLowerCase() === 'completed';
      const canFb = (endedByDate || endedByStatus) && this.isPositiveRsvp(g.status as any);
      console.log(ev?.endDate, canFb);
      return {
        eventId: g.eventId,
        eventName: ev?.name ?? 'Unknown Event',
        startDate: ev?.startDate ?? '',
        endDate: ev?.endDate ?? '',
        location: ev?.location ?? '',
        rsvp: g.status,
        inviteToken: (g as any).inviteToken,
        canFeedback: canFb,
      };
    });

    rows.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    this.rows.set(rows);
  }

  async saveProfile() {
    this.errorMsg.set(null);
    this.saveMsg.set(null);
    const name = (this.name() || '').trim();
    const phone = (this.phone() || '').trim();
    const email = (this.email() || '').trim().toLowerCase();
    const pass = (this.password() || '').trim();

    if (!name || !email || !phone) {
      this.errorMsg.set('Please fill out name, email and phone.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errorMsg.set('Invalid email address.');
      return;
    }
    if (!/^01[0-9]{9}$/.test(phone)) {
      this.errorMsg.set('Phone must start with 01 and be 11 digits.');
      return;
    }
    if (this.changePassword() && pass.length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }

    this.saving.set(true);
    try {
      const GKEY = 'userGuests';
      const raw = localStorage.getItem(GKEY);
      const list: User[] = raw ? JSON.parse(raw) : [];
      const current = this.user();
      if (!current) return;

      const idx = list.findIndex(
        (u) => (u.email ?? '').toLowerCase() === current.email!.toLowerCase()
      );
      if (idx === -1) {
        this.errorMsg.set('Current guest account was not found.');
        return;
      }

      const updated: User = {
        ...list[idx],
        name,
        email,
        phone,
        password: this.changePassword() ? this.auth.encryptText(pass) : list[idx].password,
      };

      list[idx] = updated;
      localStorage.setItem(GKEY, JSON.stringify(list));
      localStorage.setItem('loggedUser', JSON.stringify(updated));
      (window as any).dispatchEvent?.(new CustomEvent('auth-changed'));

      this.user.set(updated);
      this.saveMsg.set('Profile updated successfully.');
      this.password.set('');
      this.changePassword.set(false);
      this.buildRows();
    } catch (e) {
      console.error(e);
      this.errorMsg.set('Failed to save changes.');
    } finally {
      this.saving.set(false);
    }
  }

  isPositiveRsvp(status: string | undefined | null): boolean {
    const s = (status ?? '').toLowerCase();
    return s === 'accepted' || s === 'registered' || s === 'confirmed';
  }

  togglePwdVisibility() {
    this.showPassword.set(!this.showPassword());
  }
  openInvite(token?: string) {
    if (token) this.router.navigate(['/guest/invite', token]);
  }
  leaveFeedback(row: Row) {
    if (!row.canFeedback) return;

    this.router.navigate(['/guest/feedback', row.eventId]);
  }
}
