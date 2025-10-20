import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';
import { DataService } from '../../../core/services/dataService/data-service';
import { AuthService } from '../../../core/services/authService/auth';
import { User } from '../../../core/models/users';
import { Guest } from '../../../core/models/guests'; // adjust the path if different

type Row = Guest & { eventName: string };

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './guests.html',
  styleUrl: './guests.css'
})
export class Guests implements OnInit {
  // table columns
  guestsColumns: TableColumn[] = [
    { key: 'name',              label: 'Guest Name', type: 'avatar' },
    { key: 'email',             label: 'Email',      type: 'text'   },
    { key: 'phone',             label: 'Phone',      type: 'text'   },
    { key: 'eventName',         label: 'Event',      type: 'text'   },
    { key: 'status',            label: 'Status',     type: 'status' },
    { key: 'registrationDate',  label: 'Registered', type: 'date'   }
  ];

  // status filter only (search handled via the table's search box)
  guestsFilters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Invited',  label: 'Invited'  },
        { value: 'Accepted', label: 'Accepted' },
        { value: 'Declined', label: 'Declined' },
        { value: 'Pending',  label: 'Pending'  },
      ]
    }
  ];

  /** raw and filtered data */
  private allGuests: Row[] = [];
  guestsData: Row[] = [];

  /** current filter state */
  private searchTerm = '';
  private selectedStatus = '';

  /** role state */
  private isOrganizer = false;
  private currentUserId: number | null = null;

  constructor(private data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    // who is logged in?
    const user: User | null = this.auth.getLoggedUser?.() ?? JSON.parse(localStorage.getItem('loggedUser') || 'null');
    const role = (user?.role || '').toLowerCase();
    this.isOrganizer = role === 'organizer';
    this.currentUserId = user?.id ?? null;

    // build eventId -> name map, and compute visible event ids for organizers
    const events = this.data.events() || [];
    const byId = new Map<number, string>(events.map(e => [e.id, e.name]));
    const visibleEventIds = new Set<number>(
      this.isOrganizer && this.currentUserId != null
        ? events.filter(e => e.createdBy === this.currentUserId).map(e => e.id)
        : events.map(e => e.id) // admins (or other roles) see all events
    );

    // load guests, restrict by organizer’s own events if applicable, and enrich with eventName
    const guests = (this.data.guests() || []) as Guest[];
    const scoped = this.isOrganizer
      ? guests.filter(g => visibleEventIds.has(g.eventId))
      : guests;

    this.allGuests = scoped.map(g => ({
      ...g,
      eventName: byId.get(g.eventId) ?? 'Unknown Event'
    }));

    // initial render
    this.applyFilters();
  }

  /** Combine search (by name) + status filter */
  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const status = this.selectedStatus.trim().toLowerCase();

    let list = [...this.allGuests];

    if (status) {
      list = list.filter(g => (g.status ?? '').toLowerCase() === status);
    }
    if (term) {
      list = list.filter(g => (g.name ?? '').toLowerCase().includes(term));
    }

    // newest first (assuming original array is chronological)
    this.guestsData = list.reverse();
  }

  // ===== Table output handlers =====
  onSearchGuests(value: string): void {
    this.searchTerm = (value ?? '').toLowerCase();
    this.applyFilters();
  }

  onFilterGuests(filter: { key: string; value: string }): void {
    if (!filter) return;

    if (filter.key === '__clearAll__') {
      this.selectedStatus = '';
      this.searchTerm = '';
      this.applyFilters();
      return;
    }

    if (filter.key === 'status') {
      this.selectedStatus = (filter.value ?? '');
      this.applyFilters();
    }
  }

  // not used (no actions), kept for template compatibility
  onCreateGuest(): void {}
  onViewGuest(_: any): void {}
  onEditGuest(_: any): void {}
  onDeleteGuest(_: any): void {}
  onPageChange(_: number): void {}
}
