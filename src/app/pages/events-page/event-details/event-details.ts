import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../core/services/events-service/events-service';
import { DataService } from '../../../core/services/dataService/data-service';
import { AuthService } from '../../../core/services/authService/auth';
import { ToastService } from '../../../core/services/toastService/toast-service';
import { Ievents } from '../../../core/models/ievents';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.css'],
})
export class EventDetails implements OnInit {
  event: Ievents | undefined;
  eventID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventsService,
    private dataService: DataService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.eventID = Number(this.route.snapshot.paramMap.get('id'));
    this.event = this.eventService.events.find(e => e.id === this.eventID);

    const shouldRegister = this.route.snapshot.queryParamMap.get('register');
    if (shouldRegister === '1' && this.auth.isLoggedIn()) {
      setTimeout(() => this.registerForEvent(), 200);
    }
  }

  /** Registration is closed if event is completed/cancelled or end date already passed */
  get registrationClosed(): boolean {
    const e = this.event;
    if (!e) return true;
    const status = (e.status ?? '').toLowerCase();
    if (status === 'completed' || status === 'cancelled') return true;

    const end = new Date(e.endDate);
    return !isNaN(end.getTime()) && new Date() > end;
  }

  private nextId(list: { id: number }[]): number {
    return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
  }

  private ensureGuestLimit(eventId: number, toAddCount: number) {
    const e = this.dataService.events().find(ev => ev.id === eventId);
    let currentCount = 0;

    if (e && (e as any).guestIds) {
      currentCount = ((e as any).guestIds as number[]).length;
    } else {
      currentCount = this.dataService.guests().filter(g => g.eventId === eventId).length;
    }

    if (currentCount + toAddCount > 300) {
      throw new Error('This event reached capacity (max 300 guests).');
    }
  }

  registerForEvent() {
    if (!this.event) return;

    // ⛔ closed?
    if (this.registrationClosed) {
      this.toast?.show('error', 'Registration is closed for this event.');
      return;
    }

    // not logged in → redirect then come back
    if (!this.auth.isLoggedIn()) {
      const returnUrl = `/events/${this.eventID}?register=1`;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
      this.toast?.show('info', 'Please login to register for this event.');
      return;
    }

    const logged = this.auth.getLoggedUser();
    if (!logged) {
      this.toast?.show('error', 'Unable to identify logged user.');
      return;
    }

    try {
      this.ensureGuestLimit(this.eventID, 1);

      const allGuests = this.dataService.guests();
      const existing = allGuests.find(
        g =>
          g.eventId === this.eventID &&
          g.email.toLowerCase() === (logged.email || '').toLowerCase()
      );
      if (existing) {
        this.toast.show('info', 'You are already registered for this event.');
        return;
      }

      const newGuest = {
        id: this.nextId(allGuests),
        eventId: this.eventID,
        name: logged.name || (logged.email || '').split('@')[0],
        email: (logged.email || '').toLowerCase(),
        phone: logged.phone || '',
        status: 'Accepted',
        feedbackId: null,
        registrationDate: new Date().toISOString(),
      } as any;

      this.dataService.updateGuests([...allGuests, newGuest]);

      const events = this.dataService.events();
      const idx = events.findIndex(e => e.id === this.eventID);
      if (idx !== -1) {
        const gi = ((events[idx] as any).guestIds ?? []) as number[];
        (events[idx] as any).guestIds = [...gi, newGuest.id];
        this.dataService.updateEvents([...events]);
        this.event = events[idx];
      }

      this.toast.show('success', 'You have been registered for the event.');
    } catch (err: any) {
      this.toast.show('error', err?.message || 'Failed to register.');
    }
  }
}
