import { TestBed, async, inject } from '@angular/core/testing';

import { HomeRouteActivatorGuard } from './home-route-activator.guard';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { Router } from '@angular/router';
import { authServiceMock } from '../auth/__mocks__/authService.mock';
import { MatDialog } from '@angular/material';
import { matDialogMock } from './__mocks__/matDialog.mock';

describe('HomeRouteActivatorGuard', () => {

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
        { provide: AuthService, useValue: authServiceMock },
        { provide: CookieService, useValue: mockCookieService },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    });
  });

  it('should ...', inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
