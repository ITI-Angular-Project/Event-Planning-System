// core/guards/auth-guards.ts
import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AppRole, AuthService } from '../../services/authService/auth';

// Block login/register when already logged in
export const authPageGuard = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;

  return auth.hasRole('admin', 'organizer')
    ? router.createUrlTree(['/dashboard'])
    : router.createUrlTree(['/']);
};

// Allow dashboard only for admin/organizer
export const dashboardGuard = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (!auth.hasRole('admin' as AppRole, 'organizer' as AppRole)) {
    return router.createUrlTree(['/']);
  }
  return true;
};
