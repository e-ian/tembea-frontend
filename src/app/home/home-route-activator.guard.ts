import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { AuthService } from '../auth/__services__/auth.service';
import { MatDialog } from '@angular/material';
import { UnauthorizedLoginComponent } from '../auth/unauthorized-login/unauthorized-login.component';

@Injectable({
  providedIn: 'root'
})
export class HomeRouteActivatorGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
    ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const { isAuthorized, isAuthenticated } = this.authService;

    if (!isAuthorized) {
      this.dialog.open(UnauthorizedLoginComponent,
        {panelClass: 'tembea-modal', backdropClass: 'tembea-backdrop'});
    }
    if (isAuthenticated) {
      return true;
    }
    const token = this.cookieService.get('jwt_token');
    if (isAuthorized && token) {
      this.router.navigate([`/login/redirect`], { queryParams: { token } });
      return false;
    }
    return true;
  }
}
