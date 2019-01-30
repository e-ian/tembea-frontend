import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { AuthService } from '../__services__/auth.service';
import { CookieService } from '../__services__/ngx-cookie-service.service';
import { ClockService } from '../__services__/clock.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/user.model';
import { Subscription, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    const mockCookieService = {
      delete: () => {}
    };
    const mockRouter = {
      navigate: () => {}
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useValue: mockCookieService },
        { provide: ClockService, useValue: mockClockService },
        { provide: Router, useValue: mockRouter }
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
    expect(service.cookieService.delete).toHaveBeenCalledTimes(1);
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

    const loginRequest: TestRequest = httpTestingController.expectOne(`${tembeaBackEndUrl}/api/v1/auth/login/verify`);

    expect(loginRequest.request.method).toEqual('GET');

    loginRequest.flush(response);
  });
});
