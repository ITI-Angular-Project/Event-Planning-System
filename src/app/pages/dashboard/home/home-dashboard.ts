import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { Event } from '../../../core/models/events';
import { Guest } from '../../../core/models/guests';
import { Expense } from '../../../core/models/expenses';
import { Feedback } from '../../../core/models/feedback';
import { User } from '../../../core/models/users';

@Component({
  selector: 'app-home-dashboard',
  imports: [CurrencyPipe, StatCard],
  templateUrl: './home-dashboard.html',
  styleUrl: './home-dashboard.css',
})
export class HomeDashboard implements OnInit {
  stats = signal({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalGuests: 0,
    totalExpenses: 0,
    avgFeedback: 0,
  });

  loggedUser!: User;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.loadDashboardData();
  }

  loadDashboardData() {
    const events: Event[]= JSON.parse(localStorage.getItem('events') || '[]');
    const guests: Guest[] = JSON.parse(localStorage.getItem('guests') || '[]');
    const expenses: Expense[] = JSON.parse(localStorage.getItem('expenses') || '[]');
    const feedback: Feedback[] = JSON.parse(localStorage.getItem('feedback') || '[]');

    let filteredEvents = events;
    let filteredGuests = guests;
    let filteredExpenses = expenses;
    let filteredFeedback = feedback;

    if (this.loggedUser.role === 'organizer') {
      console.log(filteredEvents);

      filteredEvents = events.filter((e: any) => e.createdBy === this.loggedUser.id);
      console.log(filteredEvents);

      const eventIds = filteredEvents.map((e: any) => e.id);

      filteredGuests = guests.filter((g: any) => eventIds.includes(g.eventId));
      filteredExpenses = expenses.filter((ex: any) => eventIds.includes(ex.eventId));
      filteredFeedback = feedback.filter((f: any) => eventIds.includes(f.eventId));
    }

    const totalEvents: number = filteredEvents.length;
    const upcomingEvents: number = filteredEvents.filter((e: any) => e.status === 'up-coming').length;
    const completedEvents: number = filteredEvents.filter((e: any) => e.status === 'completed').length;
    const totalGuests: number = filteredGuests.length;
    const totalExpenses: number = filteredExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const avgFeedback: number =
      filteredFeedback.length > 0
        ? Number(
            (filteredFeedback.reduce((a: number, b: any) => a + b.rating, 0) / filteredFeedback.length).toFixed(1)
          )
        : 0;

    this.stats.set({
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalGuests,
      totalExpenses,
      avgFeedback,
    });
  }
}
