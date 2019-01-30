import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from '../auth/ngx-cookie-service.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeRouteActivatorGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService
    ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const { isAuthorized, isAuthenticated } = this.authService;
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
