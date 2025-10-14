import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { HomeDashboard } from './pages/dashboard/home/home-dashboard';
import { EventsList } from './pages/dashboard/events/events-list/events-list';
import { EventDetails } from './pages/dashboard/events/event-details/event-details';
import { Tasks } from './pages/dashboard/tasks/tasks';
import { Guests } from './pages/dashboard/guests/guests';
import { Expenses } from './pages/dashboard/expenses/expenses';
import { Reports } from './pages/dashboard/reports/reports';
import { Users } from './pages/dashboard/users/users';
import { Profile } from './pages/dashboard/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [],
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: HomeDashboard,
      },
      {
        path: 'events',
        component: EventsList,
      },
      {
        path: 'events/:id',
        component: EventDetails,
      },
      {
        path: 'tasks',
        component: Tasks,
      },
      {
        path: 'guests',
        component: Guests,
      },
      {
        path: 'expenses',
        component: Expenses,
      },
      {
        path: 'reports',
        component: Reports,
      },
      {
        path: 'users',
        component: Users,
      },
      {
        path: 'profile',
        component: Profile,
      },
    ],
  },
  {
    path: '**',
    component: NotFound,
  },
];
