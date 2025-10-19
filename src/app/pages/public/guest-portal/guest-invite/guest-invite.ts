import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/dataService/data-service';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { Guest } from '../../../../core/models/guests';
import { CommonModule } from '@angular/common';
import { GuestFeedback } from "../guest-feedback/guest-feedback";

@Component({
  selector: 'app-guest-invite',
  imports: [CommonModule, GuestFeedback],
  templateUrl: './guest-invite.html',
  styleUrl: './guest-invite.css'
})
export class GuestInvite {
private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private toast = inject(ToastService);

  token = '';
  guest = signal<Guest | null>(null);
  event = signal<any>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    const g = this.data.guests().find(x => x.inviteToken === this.token);
    if (!g) { this.error.set('Invalid or expired invitation link.'); return; }
    this.guest.set(g);
    this.event.set(this.data.events().find(e => e.id === g.eventId) ?? null);
  }

  private updateGuest(next: Guest) {
    const list = this.data.guests().map(g => g.id === next.id ? next : g);
    this.data.updateGuests(list);
    this.guest.set(next);
  }

  accept() {
    const g = this.guest(); if (!g) return;
    this.updateGuest({ ...g, status: 'Accepted', respondedAt: new Date().toISOString() });
    this.toast.show('success', 'You have accepted the invitation. 🎉');
  }

  decline() {
    const g = this.guest(); if (!g) return;
    this.updateGuest({ ...g, status: 'Declined', respondedAt: new Date().toISOString() });
    this.toast.show('info', 'You have declined the invitation.');
  }
}
