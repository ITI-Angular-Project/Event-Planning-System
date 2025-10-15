import { Routes } from '@angular/router';

// Layouts
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

// Pages - Dashboard
import { HomeDashboard } from './pages/dashboard/home/home-dashboard';
import { EventsList } from './pages/dashboard/events/events-list/events-list';
import { EventDetails } from './pages/dashboard/events/event-details/event-details';

// Pages - log-reg
import { Login } from './pages/log-reg/login/login';
import { Register } from './pages/log-reg/register/register';

// Pages - Public (الجديدة)
import { About } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';

// Other Pages
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  // Public Layout
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirect default to login
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      // إضافة About و Contact هنا
      { path: 'about', component: About },
      { path: 'contact', component: ContactComponent },
    ],
  },

  // Dashboard Layout
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

  // Not Found
  {
    path: '**',
    component: NotFound,
  },
];
