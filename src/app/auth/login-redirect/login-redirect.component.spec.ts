import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginRedirectComponent } from './login-redirect.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TOASTR_TOKEN, Toastr } from 'src/app/shared/toastr.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mockAuthService } from '../__mocks__/authService.mock';
import {
  mockActivatedRoute,
  mockRouter,
  mockToastr
} from 'src/app/shared/__mocks__/mockData';

describe('LoginRedirectComponent', () => {
  let component: LoginRedirectComponent;
  let fixture: ComponentFixture<LoginRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginRedirectComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TOASTR_TOKEN, useValue: mockToastr }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRedirectComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Login Method', () => {
    it('should get token from queryParam', () => {
      const route: ActivatedRoute = TestBed.get(ActivatedRoute);
      fixture.detectChanges();

      expect(route.snapshot.queryParams.token).toEqual('authToken');
    });

    it('should call unauthorizeUser method when token is falsely', () => {
      const route: ActivatedRoute = TestBed.get(ActivatedRoute);
      const service: AuthService = TestBed.get(AuthService);
      jest.spyOn(service, 'unAuthorizeUser');
      route.snapshot.queryParams.token = false;
      fixture.detectChanges();

      expect(route.snapshot.queryParams.token).toEqual(false);
      expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
    });

    it('should call the login method when a token exists', () => {
      const service: AuthService = TestBed.get(AuthService);
      const loginDataMock = { data: { isAuthorized: true } };
      jest.spyOn(service, 'unAuthorizeUser');
      jest.spyOn(service, 'login').mockReturnValue(of(loginDataMock));
      jest.spyOn(service, 'authorizeUser');
      fixture.detectChanges();

      expect(service.unAuthorizeUser).toHaveBeenCalledTimes(0);
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.authorizeUser).toHaveBeenCalledTimes(1);
      expect(service.authorizeUser).toHaveBeenCalledWith(loginDataMock.data);
    });

    it('should call login method and handleError', () => {
      const service: AuthService = TestBed.get(AuthService);
      const errorMock = new Error('Login failed');
      jest.spyOn(service, 'unAuthorizeUser');
      jest.spyOn(service, 'login').mockReturnValue(throwError(errorMock));
      jest.spyOn(service, 'authorizeUser');
      jest.spyOn(component, 'handleEventError');
      fixture.detectChanges();

      expect(service.unAuthorizeUser).toHaveBeenCalledTimes(0);
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.authorizeUser).toHaveBeenCalledTimes(0);
      expect(component.handleEventError).toHaveBeenCalledWith(errorMock);
    });
  });

  describe('handleEventError', () => {
    it('should call unAuthorizeUser method', () => {
      const service: AuthService = TestBed.get(AuthService);
      const router: Router = TestBed.get(Router);
      const toastr: Toastr = TestBed.get(TOASTR_TOKEN);
      const errorMock = new HttpErrorResponse({
        error: 'Server Error',
        headers: null,
        status: 401
      });
      jest.spyOn(service, 'unAuthorizeUser');
      jest.spyOn(router, 'navigate');
      jest.spyOn(toastr, 'error');

      component.handleEventError(errorMock);

      expect(service.unAuthorizeUser).toHaveBeenCalledTimes(1);
      expect(toastr.error).toHaveBeenCalledTimes(0);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    it('should call the toastr and navigate method', () => {
      const service: AuthService = TestBed.get(AuthService);
      const router: Router = TestBed.get(Router);
      const toastr: Toastr = TestBed.get(TOASTR_TOKEN);
      const errorMock = new Error('Login failed');
      jest.spyOn(service, 'unAuthorizeUser');
      jest.spyOn(router, 'navigate');
      jest.spyOn(toastr, 'error');

      component.handleEventError(errorMock);

      expect(service.unAuthorizeUser).toHaveBeenCalledTimes(0);
      expect(toastr.error).toHaveBeenCalledTimes(1);
      expect(toastr.error).toHaveBeenCalledWith(
        'Something went wrong! try again'
      );
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
