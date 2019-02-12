import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IUser } from '../../shared/user.model';
import { CookieService } from './ngx-cookie-service.service';
import { ClockService } from './clock.service';
import { Toastr, TOASTR_TOKEN } from 'src/app/shared/toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static lastActiveTime: number;
  authUrl = `${environment.tembeaBackEndUrl}/api/v1/auth/verify`;
  andelaAuthServiceToken: string;
  tembeaToken: string;
  private currentUser: IUser;
  isAuthenticated = false;
  isAuthorized = true;
  clockSubscription: Subscription;

  constructor(
    private http: HttpClient,
    public cookieService: CookieService,
    private clock: ClockService,
    private router: Router,
    @Inject(TOASTR_TOKEN) public toastr: Toastr
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
    this.clockSubscription = this.clock.getClock().subscribe(data => {
      const elapsedTime = (data - AuthService.lastActiveTime) / (1000 * 60);
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
    return this.http.get<any>(this.authUrl, { headers: setHeaders });
  }

  logout(): void {
    this.cookieService.delete('jwt_token', '/');
    this.cookieService.delete('tembea_token', '/');
    this.isAuthenticated = false;
    this.clockSubscription.unsubscribe();
  }

  authorizeUser(response: any) {
    const { token, userInfo } = response;
    this.isAuthorized = true;
    this.isAuthenticated = true;
    this.tembeaToken = token;
    this.setCurrentUser(userInfo);
    this.toastr.success('Login Successful');
    this.cookieService.set('tembea_token', `${token}`, 0.125, '/');
    this.setupClock();
    return this.router.navigate(['/admin']);
  }



  public setupClock(): void {
    AuthService.lastActiveTime = Date.now();
    this.initClock();
  }

  unAuthorizeUser() {
    this.isAuthorized = false;
    this.router.navigate(['/']);
  }
}
