import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../core/models/menu-items';
import { User } from '../../../core/models/users';
import { DataService } from '../../../core/services/dataService/data-service';
import { AuthService } from '../../../core/services/authService/auth';
import { Task } from '../../../core/models/tasks';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  constructor(private data: DataService, private auth: AuthService) {}

  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() requestClose = new EventEmitter<void>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  loggedInUser: User = JSON.parse(localStorage.getItem('loggedUser') || '{}');

  // Tasks badge is initialized to 0 so it's always present in the template.
  menuItems: MenuItem[] = [
    {
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      label: 'Events',
      route: '/dashboard/events',
    },
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      label: 'Tasks',
      route: '/dashboard/tasks',
      badge: 0,
    },
    {
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      label: 'Guests',
      route: '/dashboard/guests',
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      label: 'Expenses',
      route: '/dashboard/expenses',
    },
    {
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      label: 'Users',
      route: '/dashboard/users',
      roles: ['admin'],
    },
    {
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      label: 'Profile',
      route: '/dashboard/profile',
    },
  ];

  isCollapsed() {
    return this.collapsed;
  }

  closeMobile() {
    this.mobileOpenChange.emit(false);
    this.requestClose.emit();
  }

  ngOnInit(): void {
    const u = this.auth.getLoggedUser?.() ?? this.loggedInUser;
    const role = (u?.role || '').toLowerCase();
    const isOrganizer = role === 'organizer';
    const userId = u?.id;

    const events = this.data.events() || [];
    const visibleEventIds = new Set<number>(
      isOrganizer && userId != null
        ? events.filter(e => e.createdBy === userId).map(e => e.id)
        : events.map(e => e.id)
    );



    const tasks = (this.data.tasks() || []) as Task[];
    const today0 = this.midnightToday();

    const count = tasks.filter(t => {
      if (isOrganizer && !visibleEventIds.has(t.eventId)) return false;
      const statusOk = (t.status || '').toLowerCase() === 'in-progress';
      const notOverdue = new Date(t.deadline) > today0;
      return statusOk && notOverdue;
    }).length;

    this.setTasksBadge(count);
  }

  private setTasksBadge(count: number) {
    this.menuItems = this.menuItems.map(mi =>
      mi.label === 'Tasks' ? { ...mi, badge: count } : mi
    );
  }

  private midnightToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
