import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { HomeDashboard } from './pages/dashboard/home/home-dashboard';
import { EventsList } from './pages/dashboard/events/events-list/events-list';
import { EventDetails } from './pages/dashboard/events/event-details/event-details';

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
    ],
  },
  {
    path: '**',
    component: NotFound,
  },
];
