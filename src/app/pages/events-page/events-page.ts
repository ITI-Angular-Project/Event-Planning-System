import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ievents } from '../../core/models/ievents';
import { EventsService } from '../../core/services/events-service/events-service';
import { Events } from "../events/events";

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [FormsModule, Events],
  templateUrl: './events-page.html',
  styleUrls: ['./events-page.css'], // ✅ fixed
})
export class EventsPage implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  filteredEvents: Ievents[] = [];
  events: Ievents[] = [];

  constructor(private eventService: EventsService) {} // ✅ fixed

  ngOnInit(): void {
    this.events = this.eventService.events;
    this.filteredEvents = [...this.events];
  }

  // uniqueCategories without repeating
  get uniqueCategories(): string[] {
    return Array.from(new Set(this.events.map(e => e.category)));
  }

  // uniquestatus without repeating
  get uniqueStatus(): string[] {
    return Array.from(new Set(this.events.map(e => e.status)));
  }

  // 🔍 Live search function

  filterEvents(): void {
  const term = this.searchTerm.toLowerCase();
  const category = this.selectedCategory.toLowerCase();
  const status = this.selectedStatus.toLowerCase();

  this.filteredEvents = this.events.filter((ev) => {
    const title = ev.name?.toLowerCase() ?? '';
    const location = ev.location?.toLowerCase() ?? '';
    const description = ev.description?.toLowerCase() ?? '';
    const evCategory = ev.category?.toLowerCase() ?? '';
    const evStatus = ev.status?.toLowerCase() ?? '';

    const matchesSearch =
      title.includes(term) ||
      location.includes(term) ||
      description.includes(term);

    const matchesCategory =
      !category || evCategory === category;

    const matchesStatus =
      !status || evStatus === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}
}
