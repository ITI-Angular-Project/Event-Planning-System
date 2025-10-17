import { Injectable } from '@angular/core';
import { Ievents } from '../../models/ievents';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events: Ievents[] = [];

  constructor() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents) as Ievents[];
    } else {
      this.events = []; // default empty array if nothing in localStorage
    }
  }
}
