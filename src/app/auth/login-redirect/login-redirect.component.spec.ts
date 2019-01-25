import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { LoginRedirectComponent } from './login-redirect.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TOASTR_TOKEN } from 'src/app/shared/toastr.service';

describe('LoginRedirectComponent', () => {
  let component: LoginRedirectComponent;
  let fixture: ComponentFixture<LoginRedirectComponent>;

  beforeEach(async(() => {
    const mockActivatedRoute = {
      snapshot: {
        queryParams: {
          token: 'authToken'
        }
      }
    }

    const mockAuthService = {
      andelaAuthServiceToken: '',
      isAuthorized: '',
      isAuthenticated: '',
      currentUser: {},
      login: (): Observable<any> => {
        return of({ data: {
          isAuthorized: true
        }})
      }
    }

    const mockRouter = {
      navigate: () => {}
    }

    const mockToastr = {
      success: () => {},
      error: () => {}
    }

    TestBed.configureTestingModule({
      declarations: [ LoginRedirectComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TOASTR_TOKEN, useValue: mockToastr }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get token from queryParam', () => {
    const route: ActivatedRoute = TestBed.get(ActivatedRoute);

    expect(route.snapshot.queryParams.token).toEqual('authToken')
  })
});
