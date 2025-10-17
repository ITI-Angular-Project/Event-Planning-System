import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ievents } from '../../core/models/ievents';
import { EventsService } from '../../core/services/events-service/events-service';
import { Events } from "../events/events";

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [FormsModule, Events],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})

export class EventsPage {
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  filteredEvents: Ievents[] = [];

  events:Ievents[]=[];
  constructor(serevent:EventsService) {
    this.events=serevent.events;
    // show all events initially
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
      const matchesSearch =
        ev.title.toLowerCase().includes(term) ||
        ev.location.toLowerCase().includes(term) ||
        ev.description?.toLowerCase().includes(term);

      const matchesCategory =
        !category || ev.category.toLowerCase() === category;

      const matchesStatus = !status || ev.status.toLowerCase() === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  resolved(e:any){
    console.log("eis : ",e);
    alert(e);

  }

}
