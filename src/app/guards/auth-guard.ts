import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      return true;
    }

    // Save the attempted URL
    sessionStorage.setItem('redirectUrl', state.url);
  }

  return router.createUrlTree(['/account/login']);
};
