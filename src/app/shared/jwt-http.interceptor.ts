import {Inject, Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../auth/__services__/auth.service';
import {Toastr, TOASTR_TOKEN} from './toastr.service';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(TOASTR_TOKEN) public toastr: Toastr
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { tembeaToken } = this.authService;
    if (!req.url.includes('/auth/verify') && tembeaToken) {
      const authReq = req.clone({ setHeaders: { Authorization: tembeaToken } });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastr.error('Unauthorized access');
          }
          return throwError(error);
        })
      )
    }

    return next.handle(req);
  }
}
