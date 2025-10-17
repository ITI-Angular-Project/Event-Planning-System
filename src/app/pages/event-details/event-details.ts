import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../core/services/events-service/events-service';
import { Ievents } from '../../core/models/ievents';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.css'],
})
export class EventDetails implements OnInit {
  event: Ievents | undefined; // 👈 حدث واحد فقط
  eventID: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService
  ) {}

  ngOnInit() {
    // ✅ 1. خُد الـ id من URL
    this.eventID = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ 2. دور على الحدث داخل الـ service
    this.event = this.eventService.events.find(
      (e) => e.id === this.eventID
    );

    
  }
}

