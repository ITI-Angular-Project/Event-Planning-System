import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event } from '../../../../core/models/events';
import { DataService } from '../../../../core/services/dataService/data-service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {
  event: any = null;
  eventId!: number;
  allGuests: any[] = [];
  eventGuests: any[] = [];
  daysRemaining: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    const events = this.dataService.events();
    const guests = this.dataService.guests();
    this.allGuests = guests;

    this.event = events.find((e: any) => e.id === this.eventId);
    const now = new Date();
    const endDate = new Date(this.event.endDate);

    const diffTime = endDate.getTime() - now.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!this.event) {
      alert('Event not found!');
      this.router.navigate(['/dashboard/events']);
      return;
    }

    this.eventGuests = this.event.guestIds
      .map((gid: number) => this.allGuests.find((g) => g.id === gid))
      .filter((g: any) => !!g);
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

  onEdit(event: Event) {}
}
