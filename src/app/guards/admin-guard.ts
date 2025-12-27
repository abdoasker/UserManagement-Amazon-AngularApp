import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../Services/account-service.js';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.accountService.currentUserRole$.pipe(
      map((role) => {
        if (role === 'Admin') {
          return true; // ✅ allow access
        }
        return this.router.createUrlTree(['/home']); // ❌ redirect
      })
    );
  }
}
