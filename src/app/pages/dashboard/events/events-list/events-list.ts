import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../../shared/components/table/table';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { AuthService } from '../../../../core/services/authService/auth';
import { DataService } from '../../../../core/services/dataService/data-service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, Table, Modal, FormsModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit, OnDestroy {
  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Active state
  searchTerm: string = '';
  activeFilters: { [key: string]: string } = {};

  // Table Columns
  eventsColumns: TableColumn[] = [
    { key: 'name', label: 'Event Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'badge' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'guestsCount', label: 'Attendees', type: 'number', align: 'center' },
  ];

  // Table Filters
  eventsFilters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'up-coming', label: 'Upcoming' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'wedding', label: 'Wedding' },
        { value: 'conference', label: 'Conference' },
        { value: 'birthday', label: 'Birthday' },
        { value: 'concert', label: 'Concert' },
        { value: 'workshop', label: 'Workshop' },
      ],
    },
  ];

  // View data (only what this user can see)
  originalEventsData: any[] = [];
  eventsData = signal<any[]>([]);

  showDeleteModal = false;
  selectedEvent: any = null;
  showCreateModal = false;
  showEditModal = false;
  editingEvent: any = null;

  newEvent: any = {
    name: '',
    description: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
  };

  private statusTimer: any = null;

  constructor(
    private router: Router,
    private toast: ToastService,
    private auth: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // 1) Recompute statuses across the FULL store
    this.updateEventStatusesInStore();
    // 2) Load & filter view for current user
    this.refreshViewFromStore();

    // keep statuses fresh
    this.statusTimer = setInterval(() => this.updateEventStatusesInStore(true), 1000);
  }

  ngOnDestroy(): void {
    if (this.statusTimer) clearInterval(this.statusTimer);
  }

  /** Pull full list from store, filter for this user, compute guestsCount, and update view */
  private refreshViewFromStore(): void {
    const loggedUser = this.auth.getLoggedUser();
    const all = this.dataService.events();

    const visible =
      loggedUser?.role === 'organizer'
        ? all.filter((e: any) => e.createdBy === loggedUser?.id)
        : all;

    this.originalEventsData = visible.map((e: any) => ({
      ...e,
      guestsCount: e.guestIds?.length || 0,
    }));

    // apply search/filters on the refreshed visible set
    this.applyFilters();
  }

  /** Merge a set of changed events into the FULL store (preserving others). Also supports adds. */
  private mergeIntoStore(partialList: any[]): void {
    const all = this.dataService.events();
    const map = new Map(partialList.map(e => [e.id, e]));

    // replace existing by id if present, keep the rest
    const merged = all.map(e => map.get(e.id) ?? e);
    // add any new (ids not in all)
    const toAdd = partialList.filter(e => !all.some(a => a.id === e.id));
    const finalAll = merged.concat(toAdd);

    this.dataService.updateEvents(finalAll);
  }

  /** Remove one event by id from the FULL store */
  private deleteFromStore(id: number): void {
    const all = this.dataService.events().filter(e => e.id !== id);
    this.dataService.updateEvents(all);
  }

  /** Recalculate statuses across the FULL store, then refresh view. */
  private updateEventStatusesInStore(silent = false): void {
    const all = this.dataService.events();
    const today = new Date();

    let changed = false;
    const updated = all.map(event => {
      if ((event.status ?? '').toLowerCase() === 'cancelled') return event;

      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      let newStatus = event.status;
      if (today < start) newStatus = 'up-coming';
      else if (today >= start && today <= end) newStatus = 'in-progress';
      else if (today > end) newStatus = 'completed';

      if (newStatus !== event.status) {
        changed = true;
        return { ...event, status: newStatus };
      }
      return event;
    });

    if (changed) {
      this.dataService.updateEvents(updated);
      if (!silent) this.toast.show('info', 'Events statuses updated.');
    }

    // always refresh the visible list after possible store changes
    this.refreshViewFromStore();
  }

  // ✅ CREATE
  onCreateEvent(): void {
    this.newEvent = {
      name: '',
      description: '',
      category: '',
      location: '',
      startDate: '',
      endDate: '',
    };
    this.showCreateModal = true;
  }

  saveNewEvent(): void {
    const name = (this.newEvent.name || '').trim();

    if (
      !name ||
      !this.newEvent.category ||
      !this.newEvent.location ||
      !this.newEvent.startDate ||
      !this.newEvent.endDate
    ) {
      this.toast.show('warning', 'Please fill all required fields!', 3000);
      return;
    }

    const start = new Date(this.newEvent.startDate);
    const end = new Date(this.newEvent.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.toast.show('error', 'Invalid date format.', 3000);
      return;
    }

    if (start >= end) {
      this.toast.show('error', 'Start date must be before end date.', 3000);
      return;
    }

    const all = this.dataService.events();
    const duplicate = all.some(
      (e) => (e.name || '').trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      this.toast.show(
        'error',
        `An event named "${name}" already exists. Please use a different name.`,
        3000
      );
      return;
    }

    // robust id (based on FULL store, not visible subset)
    const newId = all.length ? Math.max(...all.map(e => e.id)) + 1 : 1;

    const eventToAdd = {
      id: newId,
      ...this.newEvent,
      status: 'up-coming',
      guestsCount: 0,
      guestIds: [],
      taskIds: [],
      expenseIds: [],
      feedbackIds: [],
      averageFeedback: 0,
      createdBy: this.auth.getLoggedUser()?.id,
    };

    // merge into full store
    this.mergeIntoStore([eventToAdd]);

    // refresh view from full store
    this.refreshViewFromStore();

    this.showCreateModal = false;
    this.toast.show('success', 'Event created successfully!');
  }

  cancelCreate(): void {
    this.showCreateModal = false;
  }

  // ✅ VIEW
  onViewEvent(event: any): void {
    this.router.navigate(['dashboard/events', event.id]);
  }

  // ✅ EDIT
  onEditEvent(event: any): void {
    this.editingEvent = { ...event };
    this.showEditModal = true;
  }

  saveEditedEvent(): void {
    const name = (this.editingEvent.name || '').trim();

    // Required fields
    if (
      !name ||
      !this.editingEvent.category ||
      !this.editingEvent.location ||
      !this.editingEvent.startDate ||
      !this.editingEvent.endDate
    ) {
      this.toast.show('warning', 'Please fill all required fields!', 3000);
      return;
    }

    // Check date order
    const start = new Date(this.editingEvent.startDate);
    const end = new Date(this.editingEvent.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.toast.show('error', 'Invalid date format.', 3000);
      return;
    }

    if (start >= end) {
      this.toast.show('error', 'Start date must be before end date.', 3000);
      return;
    }

    // Prevent duplicate event name (except self) — check against FULL store
    const all = this.dataService.events();
    const duplicate = all.some(
      (e) =>
        (e.name || '').trim().toLowerCase() === name.toLowerCase() &&
        e.id !== this.editingEvent.id
    );

    if (duplicate) {
      this.toast.show('error', `Another event named "${name}" already exists.`, 3000);
      return;
    }

    // Merge just this edited event into the full store
    const updated = { ...this.editingEvent, name };
    this.mergeIntoStore([updated]);

    // refresh visible list
    this.refreshViewFromStore();
    this.toast.show('success', `Event "${this.editingEvent.name}" updated successfully!`);

    this.showEditModal = false;
    this.editingEvent = null;
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingEvent = null;
  }

  // ✅ DELETE
  onDeleteEvent(event: any): void {
    if ((event?.status ?? '').toLowerCase() === 'completed') {
      this.toast.show('warning', 'Completed events cannot be deleted.', 3000);
      return;
    }
    this.selectedEvent = event;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.selectedEvent) return;

    // Remove from FULL store directly
    this.deleteFromStore(this.selectedEvent.id);

    // Refresh visible set
    this.refreshViewFromStore();

    this.toast.show('success', `Named ${this.selectedEvent.name} Deleted Success.`);
    this.showDeleteModal = false;
    this.selectedEvent = null;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedEvent = null;
  }

  // ✅ SEARCH
  onSearchEvents(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.applyFilters();
  }

  // FILTERS
  onFilterEvents(filter: { key: string; value: string }): void {
    if (filter.key === '__clearAll__') {
      this.activeFilters = {};
    } else if (filter.key && filter.value) {
      this.activeFilters[filter.key] = filter.value.toLowerCase();
    } else {
      delete this.activeFilters[filter.key];
    }
    this.applyFilters();
  }

  // ✅ FILTER + SEARCH core logic (works on the user-visible copy)
  applyFilters(): void {
    let filtered = [...this.originalEventsData];

    // Search filter (you can expand fields if you want)
    if (this.searchTerm) {
      const term = this.searchTerm;
      filtered = filtered.filter(event =>
        (event.name || '').toLowerCase().includes(term)
      );
    }

    // Category + Status filters (stackable)
    Object.entries(this.activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((event) => String(event[key]).toLowerCase() === value);
      }
    });

    // Reset pagination
    this.currentPage = 1;
    this.eventsData.set([...filtered].reverse());
  }

  // PAGINATION
  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
