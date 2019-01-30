import { TestBed, async, inject } from '@angular/core/testing';

import { HomeRouteActivatorGuard } from './home-route-activator.guard';
import { AuthService } from '../auth/auth.service';
import { CookieService } from '../auth/ngx-cookie-service.service';
import { Router } from '@angular/router';

describe('HomeRouteActivatorGuard', () => {
  let homeRouteActivatorGuard: HomeRouteActivatorGuard;
  let authService: AuthService;
  let cookieService: CookieService;
  let router: Router;

  const mockAuthService = {
    isAuthorized: true,
    isAuthenticated: false
  };

  const mockCookieService = {
    get: () => 'token'
  }

  const mockRouter = {
    navigate: () => { }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeRouteActivatorGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieService, useValue: mockCookieService },
      ]
    });
  });

  it('should ...', inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
