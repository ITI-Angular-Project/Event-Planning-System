import { Component, inject, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../core/services/dataService/data-service';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { AuthService } from '../../../../core/services/authService/auth';
import { Guest } from '../../../../core/models/guests';
import { Feedback } from '../../../../core/models/feedback';

@Component({
  selector: 'app-guest-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guest-feedback.html',
  styleUrl: './guest-feedback.css',
})
export class GuestFeedback {
  // Passed when embedded in the invite page
  @Input() token?: string;
  // Passed when you want to open /guest/feedback/:eventId OR via [eventId]
  @Input() eventId?: number;

  private route = inject(ActivatedRoute);
  private data  = inject(DataService);
  private toast = inject(ToastService);
  private auth  = inject(AuthService);

  // UI state
  guest   = signal<Guest | null>(null);
  event   = signal<any>(null);
  canLeave = signal(false);
  rating   = signal<number>(0);
  hover    = signal<number>(0);
  comment  = signal<string>('');
  saved    = signal(false);
  error    = signal<string | null>(null);

  // If we came from /guest/feedback/:eventId we show the full card wrapper
  standalone = signal(false);

  // unique id so the gradient id in SVG never collides
  gradId = 'grad-' + Math.random().toString(36).slice(2);

  ngOnInit() {
    // If no inputs, try to read from the route
    const routeEventId = Number(this.route.snapshot.paramMap.get('eventId'));
    if (!this.token && !this.eventId && !isNaN(routeEventId)) {
      this.eventId = routeEventId;
      this.standalone.set(true);
    } else if (this.eventId && !this.token) {
      // using [eventId] input in a page → still standalone layout
      this.standalone.set(true);
    }

    let g: Guest | undefined;

    if (this.token) {
      g = this.data.guests().find(x => (x as any).inviteToken === this.token);
      if (!g) { this.error.set('Invalid invitation link.'); return; }
    } else if (this.eventId) {
      const u = this.auth.getLoggedUser();
      if (!u || u.role !== 'guest') { this.error.set('You must be logged in as a guest to leave feedback.'); return; }
      const email = (u.email ?? '').toLowerCase();
      g = this.data.guests().find(x => x.eventId === this.eventId && (x.email ?? '').toLowerCase() === email);
      if (!g) { this.error.set('No registration found for this event.'); return; }
    } else {
      this.error.set('Missing event reference.');
      return;
    }

    this.guest.set(g ?? null);

    const ev = this.data.events().find(e => e.id === g!.eventId) ?? null;
    this.event.set(ev);

    // allow after end (date OR status completed) and RSVP positive
    const endedByDate   = ev && new Date(ev.endDate) < new Date();
    const endedByStatus = (ev?.status ?? '').toLowerCase() === 'completed';
    const positiveRsvp  = this.isPositiveRsvp(g!.status as any);

    this.canLeave.set((!!endedByDate || endedByStatus) && positiveRsvp);

    // preload existing feedback
    const fb = this.data.feedback().find(f => f.id === g!.feedbackId);
    if (fb) {
      this.rating.set(fb.rating || 0);
      this.comment.set(fb.comment || '');
    }
  }

  private isPositiveRsvp(status: string | undefined | null) {
    const s = (status ?? '').toLowerCase();
    return s === 'accepted' || s === 'registered' || s === 'confirmed';
  }

  setStars(n: number) { this.rating.set(n); }
  enter(n: number) { this.hover.set(n); }
  leave() { this.hover.set(0); }

  private nextId(list: { id: number }[]) {
    return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  }

  save() {
    const g = this.guest(); const ev = this.event();
    if (!g || !ev) return;

    if (!this.canLeave()) {
      this.toast.show('warning','Feedback is only available after the event ends and if you accepted/registered.');
      return;
    }
    if (this.rating() < 1) {
      this.toast.show('warning','Please select a star rating.');
      return;
    }

    const all = this.data.feedback();
    let fb = all.find(f => f.id === g.feedbackId);

    if (!fb) {
      const newFb: Feedback = {
        id: this.nextId(all),
        eventId: ev.id,
        guestId: g.id,
        rating: this.rating(),
        comment: (this.comment() || '').trim(),   // optional comment
        createdAt: new Date().toISOString(),
      };
      this.data.updateFeedback([...all, newFb]);

      // link feedback to guest
      const guests = this.data.guests().map(x => x.id === g.id ? ({ ...x, feedbackId: newFb.id }) : x);
      this.data.updateGuests(guests);
      this.guest.set({ ...g, feedbackId: newFb.id });
    } else {
      const updated: Feedback = { ...fb, rating: this.rating(), comment: (this.comment() || '').trim() };
      const next = all.map(f => f.id === fb!.id ? updated : f);
      this.data.updateFeedback(next);
    }

    this.saved.set(true);
    this.toast.show('success','Thanks! Your rating was saved.');
  }
}
