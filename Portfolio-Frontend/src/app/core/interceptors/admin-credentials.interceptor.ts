import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const adminCredentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const adminRequest = request.url.startsWith('/api/admin');
  return next(adminRequest ? request.clone({ withCredentials: true }) : request).pipe(
    catchError((error: unknown) => {
      if (adminRequest && error instanceof HttpErrorResponse && error.status === 401 && !router.url.startsWith('/admin/login')) {
        void router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    }),
  );
};
