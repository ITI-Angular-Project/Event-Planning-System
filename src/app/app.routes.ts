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
import { Profile } from './pages/dashboard/profile/profile';

// Pages - log-reg
import { Login } from './pages/log-reg/login/login';
import { Register } from './pages/log-reg/register/register';

// Other Pages
import { NotFound } from './pages/not-found/not-found';

// Pages - log-reg
import { Login } from './pages/log-reg/login/login';
import { Register } from './pages/log-reg/register/register';

// Pages - Public (الجديدة)
import { About } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';

// Other Pages
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
<<<<<<< HEAD
  // Public Layout
=======

>>>>>>> 8bf8bbaeca9e4fd275861afc10520be61635adda
  {
    path: '',
    component: PublicLayout,
    children: [
<<<<<<< HEAD
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirect default to login
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      // إضافة About و Contact هنا
      { path: 'about', component: About },
      { path: 'contact', component: ContactComponent },
    ],
  },

=======
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },


>>>>>>> 8bf8bbaeca9e4fd275861afc10520be61635adda
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

  // Not Found
  {
    path: '**',
    component: NotFound,
  },
];
