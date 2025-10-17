import { Injectable, signal } from '@angular/core';
import { Feedback } from '../../models/feedback';
import { Expense } from '../../models/expenses';
import { Guest } from '../../models/guests';
import { Event } from '../../models/events';
import { Task } from '../../models/tasks';
import { User } from '../../models/users';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  events = signal<Event[]>(JSON.parse(localStorage.getItem('events') || '[]'));
  guests = signal<Guest[]>(JSON.parse(localStorage.getItem('guests') || '[]'));
  expenses = signal<Expense[]>(JSON.parse(localStorage.getItem('expenses') || '[]'));
  feedback = signal<Feedback[]>(JSON.parse(localStorage.getItem('feedback') || '[]'));
  tasks = signal<Task[]>(JSON.parse(localStorage.getItem('tasks') || '[]'));
  users = signal<User[]>(JSON.parse(localStorage.getItem('users') || '[]'));

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

  updateUsers(users: User[]) {
    this.users.set(users);
    localStorage.setItem('users', JSON.stringify(users));
  }

  updateSingleUser(updatedUser: User) {
    const all = this.users();
    const index = all.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      all[index] = updatedUser;
      this.updateUsers(all);
    }
  }
}
