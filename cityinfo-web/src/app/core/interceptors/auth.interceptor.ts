import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  const token = authenticationService.getToken();
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const sendToken = !!token && isApiRequest;

  const authReq = sendToken ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (sendToken && error instanceof HttpErrorResponse && error.status === 401) {
        authenticationService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
