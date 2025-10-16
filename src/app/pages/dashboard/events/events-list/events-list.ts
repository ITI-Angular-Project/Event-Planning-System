import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../../shared/components/table/table';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toastService/toast-service';
import { AuthService } from '../../../../core/services/authService/auth';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, Table, Modal, FormsModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit {
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

  // Data
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

  ngOnInit(): void {
    setInterval(() => this.updateEventStatuses(), 1000);
  }

  constructor(private router: Router, private toast: ToastService, private auth: AuthService) {
    const loggedUser = this.auth.getLoggedUser();
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const filtered =
      loggedUser?.role === 'organizer'
        ? events.filter((e: any) => e.createdBy === loggedUser?.id)
        : events;

    this.originalEventsData = filtered.map((e: any) => ({
      ...e,
      guestsCount: e.guestIds?.length || 0,
    }));
    this.updateEventStatuses();
    this.eventsData.set([...this.originalEventsData].reverse());
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
    if (!this.newEvent.name || !this.newEvent.category || !this.newEvent.location) {
      this.toast.show('warning', 'Please fill all required fields!');
      return;
    }

    const eventToAdd = {
      id: this.eventsData()[0].id + 1,
      ...this.newEvent,
      status: 'up-coming',
      guestsCount: 0,
      guestIds: [],
      taskIds: [],
      expenseIds: [],
      feedbackIds: [],
      createdBy: this.auth.getLoggedUser()?.id,
    };

    this.originalEventsData.push(eventToAdd);
    this.saveEvents();
    this.applyFilters();
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
    if (!this.editingEvent.name || !this.editingEvent.category || !this.editingEvent.location) {
      this.toast.show('warning', 'Please fill all required fields!');
      return;
    }

    const index = this.originalEventsData.findIndex((e) => e.id === this.editingEvent.id);
    if (index !== -1) {
      this.originalEventsData[index] = { ...this.editingEvent };
      this.saveEvents();
      this.applyFilters();
      this.toast.show('success', `Event "${this.editingEvent.name}" updated successfully!`);
    }

    this.showEditModal = false;
    this.editingEvent = null;
  }

  saveEvents() {
    localStorage.setItem('events', JSON.stringify(this.originalEventsData));
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingEvent = null;
  }

  // ✅ DELETE
  onDeleteEvent(event: any): void {
    this.selectedEvent = event;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.selectedEvent) return;
    this.originalEventsData = this.originalEventsData.filter((e) => e.id !== this.selectedEvent.id);
    this.saveEvents();
    this.applyFilters();
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

  // ✅ FILTER + SEARCH core logic
  applyFilters(): void {
    let filtered = [...this.originalEventsData];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter((event) => {
        const term = this.searchTerm;
        return (
          event.name.toLowerCase().includes(term) ||
          event.category.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.status.toLowerCase().includes(term)
        );
      });
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

  updateEventStatuses(): void {
    console.log('updating event status');
    const today = new Date();

    this.originalEventsData = this.originalEventsData.map((event) => {
      if (event.status === 'cancelled') return event;

      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      let newStatus = event.status;

      if (today < start) {
        newStatus = 'up-coming';
      } else if (today >= start && today <= end) {
        newStatus = 'in-progress';
      } else if (today > end) {
        newStatus = 'completed';
      }

      return { ...event, status: newStatus };
    });

    this.saveEvents();
    this.applyFilters();
  }
}
