import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { AccountService } from '../Services/account-service';
import {
  catchError,
  filter,
  switchMap,
  take,
  throwError,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { Router } from '@angular/router';

// Shared state for refresh handling
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AccountService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  // Add token to request if available
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/Account/Login') &&
        !req.url.includes('/Account/Register')
      ) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AccountService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.generateNewToken().pipe(
      switchMap((res: any) => {
        isRefreshing = false;

        // Store new token
        localStorage.getItem('token')
          ? localStorage.setItem('token', res.token)
          : sessionStorage.setItem('token', res.token);
        localStorage.getItem('refreshToken')
          ? localStorage.setItem('refreshToken', res.refreshToken)
          : sessionStorage.setItem('refreshToken', res.refreshToken);

        refreshTokenSubject.next(res.token);
        console.log(res.token);

        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${res.token}` },
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.LogOut();
        authService.setUserName(null);
        authService.setUserRole(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        sessionStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userRole');
        router.navigate(['/account/login']);
        return throwError(() => err);
      })
    );
  } else {
    // Wait for token refresh to complete
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) =>
        next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        )
      )
    );
  }
}
