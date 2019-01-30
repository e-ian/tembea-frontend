import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../shared/user.model';
import { CookieService } from './ngx-cookie-service.service';
import { ClockService } from './clock.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static lastActiveTime: number;
  authUrl = `${environment.tembeaBackEndUrl}/api/v1/auth/login/verify`;
  andelaAuthServiceToken;
  private currentUser: IUser;
  isAuthenticated = false;
  isAuthorized = true;
  clockSubscription: Subscription;

  constructor(
    private http: HttpClient,
    public cookieService: CookieService,
    private clock: ClockService,
    private router: Router
  ) {}

  getCurrentUser(): IUser {
    if (this.currentUser) {
      return { ...this.currentUser };
    }

    return null;
  }

  setCurrentUser(user: IUser): void {
    this.currentUser = { ...user };
  }

  initClock(): void {
    this.clockSubscription = this.clock.getClock()
      .subscribe((data) => {
        const elapsedTime = ((data - AuthService.lastActiveTime) / (1000 * 60))
        if (elapsedTime >= 30) {
          this.logout();
          this.router.navigate(['/']);
        }
      });
  }

  login(): Observable<any> {
    const setHeaders: HttpHeaders = new HttpHeaders({
      Authorization: this.andelaAuthServiceToken
    });
    return this.http
      .get<any>(this.authUrl, { headers: setHeaders })
  }

  logout(): void {
    this.cookieService.delete('jwt_token', '/');
    this.clockSubscription.unsubscribe();
  }
}
