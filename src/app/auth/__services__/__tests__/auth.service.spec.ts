import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { AuthService } from '../auth.service';
import { CookieService } from '../ngx-cookie-service.service';
import { ClockService } from '../clock.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/user.model';
import { Subscription, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TOASTR_TOKEN } from 'src/app/shared/toastr.service';
import { mockRouter, mockToastr, mockCookieService } from 'src/app/shared/__mocks__/mockData';


describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const response = { id: '121', name: 'james' }
  const { tembeaBackEndUrl } = environment

  beforeEach(() => {
    const mockClockService = {
      getClock: (): Observable<number> => {
        return of(6000000000);
      }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useValue: mockCookieService },
        { provide: ClockService, useValue: mockClockService },
        { provide: Router, useValue: mockRouter },
        { provide: TOASTR_TOKEN, useValue: mockToastr }
      ]
    });

    authService = TestBed.get(AuthService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should not get current user', () => {
    const service: AuthService = TestBed.get(AuthService);
    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should set and get current user', () => {
    const service: AuthService = TestBed.get(AuthService);
    service.setCurrentUser({
      id: '1',
      firstName: 'John',
      first_name: 'John',
      lastName: 'Papa',
      last_name: 'Papa',
      email: 'john.papa@angular.ng',
      name: 'John Papa',
      picture: 'string',
      roles: []
    });
    const user: IUser = service.getCurrentUser();
    expect(user.id).toBe('1');
    expect(user.firstName).toBe('John');
  });

  it('should log user out', () => {
    const service: AuthService = TestBed.get(AuthService);
    service.clockSubscription = new Subscription();
    jest.spyOn(service.cookieService, 'delete').mockImplementation(() => {});
    service.logout();
    expect(service.cookieService.delete).toHaveBeenCalledTimes(2);
    expect(service.isAuthenticated).toEqual(false);
  });

  it('should init the clock', () => {
    const service: AuthService = TestBed.get(AuthService);
    AuthService.lastActiveTime = 1000000000;
    jest.spyOn(service, 'logout');
    service.initClock();

    expect(service.logout).toHaveBeenCalledTimes(1);
  });

  it('should GET login info', () => {
    authService.login()
      .subscribe(data => {
        expect(data).toEqual(response);
      });

    const loginRequest: TestRequest = httpTestingController.expectOne(`${tembeaBackEndUrl}/api/v1/auth/verify`);

    expect(loginRequest.request.method).toEqual('GET');

    loginRequest.flush(response);
  });

  it('should test authorize user method', () => {
    const token = 'token';
    const res = { userInfo: { firstName: 'boy' }, token };
    const toastrSpy = jest.spyOn(authService.toastr, 'success');
    const cookieSpy = jest.spyOn(authService.cookieService, 'set');
    authService.authorizeUser(res);

    expect(authService.isAuthorized).toEqual(true);
    expect(authService.isAuthenticated).toEqual(true);
    expect(authService.tembeaToken).toEqual(token);
    expect(toastrSpy).toHaveBeenCalledTimes(1);
    expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
    expect(cookieSpy).toHaveBeenCalledTimes(1);
    expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
  });

  it('should authorize a user', () => {
    const token = 'token';
    const res = { userInfo: { firstName: 'boy' }, token };
    const toastrSpy = jest.spyOn(authService.toastr, 'success');
    const cookieSpy = jest.spyOn(authService.cookieService, 'set');
    const initClockSpy = jest.spyOn(authService, 'initClock').mockImplementation(() => {});
    authService.authorizeUser(res);

    expect(authService.isAuthorized).toEqual(true);
    expect(authService.isAuthenticated).toEqual(true);
    expect(authService.tembeaToken).toEqual(token);
    expect(toastrSpy).toHaveBeenCalledTimes(1);
    expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
    expect(cookieSpy).toHaveBeenCalledTimes(1);
    expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
    expect(initClockSpy).toHaveBeenCalledTimes(1);
  });

  it('should set the user as unAuthorized', () => {
    authService.unAuthorizeUser();

    expect(authService.isAuthorized).toEqual(false);
  })
});
