import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UniversalRouteActivatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    const { isAuthenticated, setCurrentUser, setupClock } = this.authService;
    const token = this.cookieService.get('tembea_token');
    const helper = new JwtHelperService();

    if (!isAuthenticated && token && !helper.isTokenExpired(token)) {
      try {
        const decoded = helper.decodeToken(token);
        setCurrentUser(decoded.userInfo);
        setupClock();
        this.authService.isAuthenticated = true;
      } catch (err) {
        console.log(err.message);
        return this.redirectHome();
      }
    }

    return this.authService.isAuthenticated ? true : this.redirectHome()
  }

  redirectHome(): boolean {
    this.router.navigate(['/']);
    return false
  }
}
