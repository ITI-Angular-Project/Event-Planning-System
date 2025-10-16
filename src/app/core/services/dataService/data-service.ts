import { Injectable, signal } from '@angular/core';
import { Feedback } from '../../models/feedback';
import { Expense } from '../../models/expenses';
import { Guest } from '../../models/guests';
import { Event } from '../../models/events';
import { Task } from '../../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  events = signal<Event[]>(JSON.parse(localStorage.getItem('events') || '[]'));
  guests = signal<Guest[]>(JSON.parse(localStorage.getItem('guests') || '[]'));
  expenses = signal<Expense[]>(JSON.parse(localStorage.getItem('expenses') || '[]'));
  feedback = signal<Feedback[]>(JSON.parse(localStorage.getItem('feedback') || '[]'));
  tasks = signal<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'));

  updateEvents(events: Event[]) {
    this.events.set(events);
    localStorage.setItem('events', JSON.stringify(events));
  }

  updateGuests(guests: Guest[]) {
    this.guests.set(guests);
    localStorage.setItem('guests', JSON.stringify(guests));
  }

  updateExpenses(expenses: Expense[]) {
    this.expenses.set(expenses);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  updateFeedback(feedback: Feedback[]) {
    this.feedback.set(feedback);
    localStorage.setItem('feedback', JSON.stringify(feedback));
  }

  updateTask(tasks: Task[]) {
    this.tasks.set(tasks);
    localStorage.setItem('task', JSON.stringify(tasks));
  }
}
