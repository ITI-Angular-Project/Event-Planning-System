import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './guests.html',
  styleUrl: './guests.css'
})
export class Guests {
  guestsColumns: TableColumn[] = [
    { key: 'name', label: 'Guest Name', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'event', label: 'Event', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'registrationDate', label: 'Registered', type: 'date' }
  ];

  guestsFilters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'event',
      label: 'Event',
      options: [
        { value: 'tech-conference', label: 'Tech Conference 2024' },
        { value: 'design-workshop', label: 'Design Workshop' },
        { value: 'team-meeting', label: 'Team Meeting' }
      ]
    }
  ];

  guestsData = JSON.parse(localStorage.getItem('guests') || '[]').reverse() ;

  onCreateGuest(): void {
    console.log('Add new guest');
  }

  onViewGuest(guest: any): void {
    console.log('View guest:', guest);
  }

  onEditGuest(guest: any): void {
    console.log('Edit guest:', guest);
  }

  onDeleteGuest(guest: any): void {
    console.log('Delete guest:', guest);
  }

  onSearchGuests(searchTerm: string): void {
    console.log('Search guests:', searchTerm);
  }

  onFilterGuests(filter: { key: string; value: string }): void {
    console.log('Filter guests:', filter);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
