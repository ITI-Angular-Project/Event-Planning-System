import { Routes } from '@angular/router';

// Layouts
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

// Pages - Dashboard
import { HomeDashboard } from './pages/dashboard/home/home-dashboard';
import { EventsList } from './pages/dashboard/events/events-list/events-list';


// Pages - log-reg
import { Login } from './pages/log-reg/login/login';
import { Register } from './pages/log-reg/register/register';

// Other Pages
import { NotFound } from './pages/not-found/not-found';
import { MainPage } from './pages/main-page/main-page';
import { EventsPage } from './pages/events-page/events-page';
import { EventDetails } from './pages/event-details/event-details';

export const routes: Routes = [

  {
    path: '',
    component: PublicLayout,
    children: [
      {path: '' , component:MainPage},
      {path:'events-page' , component:EventsPage},
      {path:"details/:id", component:EventDetails},
      { path: 'login', component: Login },
      { path: 'register', component: Register },
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
