import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Event } from '../../../../core/models/events';
import { Guest } from '../../../../core/models/guests';
import { DataService } from '../../../../core/services/dataService/data-service';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { Modal } from "../../../../shared/components/modal/modal";

// If your modal is declared as a standalone component, import it here.
// Otherwise we’re using its selector directly in HTML below.
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {
  event: Event | null = null;
  eventId!: number;

  allGuests: Guest[] = [];
  eventGuests: Guest[] = [];
  daysRemaining = 0;

  // ===== Invitation Modal state =====
  showInviteModal = signal(false);
  inviteEmail = signal('');
  inviteName = signal('');
  invitePhone = signal('');
  isSending = signal(false);
  inviteLink = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    const events = this.dataService.events();
    const guests = this.dataService.guests();
    this.allGuests = guests;

    this.event = events.find((e: any) => e.id === this.eventId) ?? null;

    if (!this.event) {
      alert('Event not found!');
      this.router.navigate(['/dashboard/events']);
      return;
    }

    // days remaining
    const now = new Date();
    const endDate = new Date((this.event as any).endDate);
    const diffTime = endDate.getTime() - now.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // event guests
    this.refreshEventGuests();
  }

  // ---------- Helpers ----------
  private refreshEventGuests() {
    if (!this.event) return;
    const gidList: number[] = (this.event as any).guestIds ?? [];
    this.eventGuests = gidList
      .map((gid: number) => this.allGuests.find((g) => g.id === gid))
      .filter((g): g is Guest => !!g);
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarGradient(index: number): string {
    const gradients = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-indigo-400',
      'from-green-400 to-teal-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400',
    ];
    return gradients[index % gradients.length];
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'up-coming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  // ---------- Invitation flow ----------
  openInviteModal() {
    this.inviteEmail.set('');
    this.inviteName.set('');
    this.invitePhone.set('');
    this.inviteLink.set(null);
    this.showInviteModal.set(true);
  }

  closeInviteModal() {
    this.showInviteModal.set(false);
  }

  private nextId(list: { id: number }[]): number {
    return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
  }

  private generateToken(): string {
    try {
      // @ts-ignore — supported in modern browsers
      return crypto.randomUUID();
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }

  private ensureGuestLimit(eventId: number, toAddCount: number) {
    const e = this.dataService.events().find((ev) => ev.id === eventId);
    let currentCount = 0;

    if (e && (e as any).guestIds) {
      currentCount = ((e as any).guestIds as number[]).length;
    } else {
      currentCount = this.dataService.guests().filter((g) => g.eventId === eventId).length;
    }

    if (currentCount + toAddCount > 300) {
      throw new Error('This event reached capacity (max 300 guests).');
    }
  }

  sendInvitation() {
    if (!this.event) return;

    const email = this.inviteEmail().trim().toLowerCase();
    const name = this.inviteName().trim() || email.split('@')[0];
    const phone = this.invitePhone().trim();

    // very light email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      this.toast.show('error', 'Please enter a valid email.');
      return;
    }

    this.isSending.set(true);

    try {
      const allGuests = this.dataService.guests();
      const ev = this.event!;
      const nowISO = new Date().toISOString();

      // find existing guest for this event
      let guest = allGuests.find((g) => g.eventId === ev.id && g.email.toLowerCase() === email);

      if (!guest) {
        // enforce capacity only when adding a new guest
        this.ensureGuestLimit(ev.id, 1);

        const token = this.generateToken();

        const newGuest: Guest = {
          id: this.nextId(allGuests),
          eventId: ev.id,
          name,
          email,
          phone,
          feedbackId: null,
          status: 'Invited',
          inviteToken: token,
          invitedAt: nowISO,
          // optional registration date for your table
          registrationDate: nowISO as any,
        };

        // persist guests
        const nextGuests = [...allGuests, newGuest];
        this.dataService.updateGuests(nextGuests);
        this.allGuests = nextGuests;

        // ensure event.guestIds includes this new guest
        const events = this.dataService.events();
        const idx = events.findIndex((e) => e.id === ev.id);
        if (idx !== -1) {
          const gi = ((events[idx] as any).guestIds ?? []) as number[];
          (events[idx] as any).guestIds = [...gi, newGuest.id];
          this.dataService.updateEvents([...events]);
          this.event = events[idx];
        }

        guest = newGuest;
      } else {
        // re-send case: ensure token + set status Invited
        const token = guest.inviteToken ?? this.generateToken();
        const updated: Guest = {
          ...guest,
          status: 'Invited',
          inviteToken: token,
          invitedAt: nowISO,
        };
        const updatedList = allGuests.map((g) => (g.id === guest!.id ? updated : g));
        this.dataService.updateGuests(updatedList);
        this.allGuests = updatedList;
        guest = updated;

        // ensure guest id is in event.guestIds
        const events = this.dataService.events();
        const idx = events.findIndex((e) => e.id === ev.id);
        if (idx !== -1) {
          const gi = ((events[idx] as any).guestIds ?? []) as number[];
          if (!gi.includes(guest.id)) {
            (events[idx] as any).guestIds = [...gi, guest.id];
            this.dataService.updateEvents([...events]);
            this.event = events[idx];
          }
        }
      }

      // deep link
      const deepLink = `${location.origin}/guest/invite/${guest.inviteToken}`;
      this.inviteLink.set(deepLink);

      // UI feedback
      this.toast.show('success', 'Invitation ready. Link copied to clipboard.');
      navigator.clipboard?.writeText(deepLink).catch(() => {});

      // refresh guests on page
      this.refreshEventGuests();
    } catch (err: any) {
      this.toast.show('error', err?.message ?? 'Failed to send invitation.');
    } finally {
      this.isSending.set(false);
    }
  }
}
