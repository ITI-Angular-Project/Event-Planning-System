import { Component, inject, Input, signal } from '@angular/core';
import { DataService } from '../../../../core/services/dataService/data-service';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { Guest } from '../../../../core/models/guests';
import { FormsModule } from '@angular/forms';
import { Feedback } from '../../../../core/models/feedback';

@Component({
  selector: 'app-guest-feedback',
  imports: [FormsModule],
  templateUrl: './guest-feedback.html',
  styleUrl: './guest-feedback.css'
})
export class GuestFeedback {
@Input() token!: string;

  private data = inject(DataService);
  private toast = inject(ToastService);

  guest = signal<Guest | null>(null);
  event = signal<any>(null);
  canLeave = signal(false);
  text = signal('');
  saved = signal(false);

  ngOnInit() {
    const g = this.data.guests().find(x => x.inviteToken === this.token) ?? null;
    if (!g) return;
    this.guest.set(g);
    const ev = this.data.events().find(e => e.id === g.eventId) ?? null;
    this.event.set(ev);

    const ended = ev && new Date(ev.endDate) < new Date();
    this.canLeave.set(!!ended && g.status === 'Accepted');

    // preload if feedback exists
    const fb = this.data.feedback().find(f => f.id === g.feedbackId);
    if (fb) this.text.set(fb.comment);
  }

  private nextId(list: { id: number }[]) {
    return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  }

  save() {
    const g = this.guest(); const ev = this.event();
    if (!g || !ev) return;

    const all = this.data.feedback();
    let fb = all.find(f => f.id === g.feedbackId);

    if (!fb) {
      const newFb: Feedback = {
        id: this.nextId(all),
        eventId: ev.id,
        guestId: g.id,
        rating: 5,
        comment: this.text(),
        createdAt: new Date().toISOString(),
      };
      this.data.updateFeedback([...all, newFb]);

      // link to guest
      const guests = this.data.guests().map(x => x.id === g.id ? { ...x, feedbackId: newFb.id } : x);
      this.data.updateGuests(guests);
      this.guest.set({ ...g, feedbackId: newFb.id });
    } else {
      const updated = { ...fb, text: this.text() };
      const next = all.map(f => f.id === fb!.id ? updated : f);
      this.data.updateFeedback(next);
    }

    this.saved.set(true);
    this.toast.show('success', 'Thanks! Your feedback was saved.');
  }
}
