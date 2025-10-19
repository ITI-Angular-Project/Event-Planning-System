import { Routes } from '@angular/router';

// Layouts
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

// Pages - Dashboard
import { HomeDashboard } from './pages/dashboard/home/home-dashboard';
import { EventsList } from './pages/dashboard/events/events-list/events-list';

import { EventDetails } from './pages/dashboard/events/event-details/event-details';
import { Tasks } from './pages/dashboard/tasks/tasks';
import { Guests } from './pages/dashboard/guests/guests';
import { Expenses } from './pages/dashboard/expenses/expenses';
import { Reports } from './pages/dashboard/reports/reports';
import { Users } from './pages/dashboard/users/users';
import { Profile as ProfileDashboard } from './pages/dashboard/profile/profile';

// Pages - log-reg
import { Login } from './pages/log-reg/login/login';
import { Register } from './pages/log-reg/register/register';

// Other Pages
import { NotFound } from './pages/not-found/not-found';
import { MainPage } from './pages/main-page/main-page';
import { EventsPage } from './pages/events-page/events-page';
import { EventDetails as HomeEvent } from './pages/events-page/event-details/event-details';
import { ContactComponent } from './pages/contact/contact';
import { About } from './pages/about/about';
import { GuestInvite } from './pages/public/guest-portal/guest-invite/guest-invite';
import { authPageGuard, dashboardGuard } from './core/guards/auth/auth-guard';
import { Profile } from './pages/public/profile/profile';
import { GuestFeedback } from './pages/public/guest-portal/guest-feedback/guest-feedback';

export const routes: Routes = [
  { path: 'login', component: Login, canMatch: [authPageGuard]},
  { path: 'register', component: Register, canMatch: [authPageGuard]},
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: MainPage },
      { path: 'events-page', component: EventsPage },
      { path: 'details/:id', component: HomeEvent },
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: About },
      { path: 'profile', component: Profile },
      { path: 'guest/invite/:token', component: GuestInvite },
      { path: 'guest/feedback/:eventId', component: GuestFeedback },
    ],
  },

  // Dashboard Layout
  {
    path: 'dashboard',
    component: DashboardLayout,
    canMatch: [dashboardGuard],
    canActivateChild: [dashboardGuard],
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
        component: ProfileDashboard,
      },
    ],
  },

  // Not Found
  {
    path: '**',
    component: NotFound,
  },
];
