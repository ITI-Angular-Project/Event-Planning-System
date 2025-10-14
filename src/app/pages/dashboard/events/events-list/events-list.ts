import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList {
  currentPage = 1;
  pageSize = 10;
  eventsColumns: TableColumn[] = [
    { key: 'name', label: 'Event Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'badge' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'endDate', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'guestsCount', label: 'Attendees', type: 'number', align: 'center' },
  ];

  eventsFilters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' },
        { value: 'draft', label: 'Draft' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'conference', label: 'Conference' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'webinar', label: 'Webinar' },
      ],
    },
  ];

  eventsData: any = [];
  guestIds = [];
  constructor() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    this.eventsData = events.map((e: any) => ({
      ...e,
      guestsCount: e.guestIds?.length || 0,
    }));
  }

  onCreateEvent(): void {
    console.log('Create new event');
    // Navigate to create event form
  }

  onViewEvent(event: any): void {
    console.log('View event:', event);
    // Navigate to event details
  }

  onEditEvent(event: any): void {
    console.log('Edit event:', event);
    // Navigate to edit event form
  }

  onDeleteEvent(event: any): void {
    console.log('Delete event:', event);
    // Show confirmation dialog and delete event
  }

  onSearchEvents(searchTerm: string): void {
    console.log('Search events:', searchTerm);
    // Filter events based on search term
  }

  onFilterEvents(filter: { key: string; value: string }): void {
    console.log('Filter events:', filter);
    // Apply filter to events data
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // Load data for new page
  }
}
