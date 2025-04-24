import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthToken } from '../models/auth.model';
import { environment } from '../../environments/environments.prod';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const http = inject(HttpClient);
  const token = localStorage.getItem("accessToken")
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  //todo: credentials: true если http Only будет готов
  
  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        const refresh = localStorage.getItem("refreshToken")
        console.log(refresh)
        if (!refresh) {
          auth.clearToken();
          return throwError(() => err);
        }
        return http.post<AuthToken>(`${environment.apiBaseUrl}/token/refresh/`, { refresh }).pipe(
          tap(tokens => auth.setToken(tokens)),
          switchMap(tokens => {
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${tokens.access}`, 'x-refresh-retry': 'true' } });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            auth.clearToken();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
