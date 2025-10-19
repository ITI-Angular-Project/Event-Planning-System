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
  styleUrls: ['./events-page.css'],
})
export class EventsPage implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  filteredEvents: Ievents[] = [];
  events: Ievents[] = [];

  currentPage = 1;
  itemsPerPage = 12;

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.events = this.eventService.events.reverse();
    this.filteredEvents = [...this.events];
  }

  get uniqueCategories(): string[] {
    return Array.from(new Set(this.events.map(e => e.category)));
  }

  get uniqueStatus(): string[] {
    return Array.from(new Set(this.events.map(e => e.status)));
  }

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

      return (
        (title.includes(term) || location.includes(term) || description.includes(term)) &&
        (!category || evCategory === category) &&
        (!status || evStatus === status)
      );
    });
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }

  get paginatedEvents(): Ievents[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginationRange(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 10;
    const pages: number[] = [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      let start = Math.max(1, current - 4);
      let end = Math.min(total, start + maxVisible - 1);
      if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  }
}
