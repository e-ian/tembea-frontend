import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { of } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { HeaderComponent } from '../header/header.component';
import { NavMenuService } from '../__services__/nav-menu.service';
import {CookieService} from '../../auth/__services__/ngx-cookie-service.service';
import {ClockService} from '../../auth/__services__/clock.service';
import {Toastr, TOASTR_TOKEN} from '../../shared/toastr.service';

const sideNavMock = {
  setSidenav: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  toggle: jest.fn(),
};


describe('SideBarComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const routerMock = {
    events: of(new NavigationEnd(0, '/', null))
  };
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: '', component: AdminComponent },
          { path: 'admin/trips/pending', component: AdminComponent },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: RouterModule, useValue: routerMock },
      ]
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  }));

  it('should create sideNav Component', () => {
    expect(component).toBeTruthy();
  });

  it('should click menu and open trips request', async () => {
    const prop = fixture.debugElement.query(By.css('#trips a'));

    jest.spyOn(component, 'menuClicked');

    prop.triggerEventHandler('click', {});

    expect(component.menuClicked).toHaveBeenCalledTimes(1);
  });

  describe('menuClicked on a large screen device', () => {
    it('should not call sideNav.close when clicked', () => {
      // test
      component.menuClicked(true);
      // assert
      expect(sideNavMock.close).toBeCalledTimes(0);
    });
  });

  describe('activeRoute', () => {
    it('should change active route', async () => {
      await fixture.ngZone.run(async () => {
        expect(component.activeRoute).toEqual('');

        await router.navigate(['admin/trips/pending']);
        expect(component.activeRoute).toContain('trips/pending');
      });
    });
  })
});

describe('SideBarComponent on small devices', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  const toastr: Toastr = window['toastr'];

  beforeEach(() => {
    // create mock
    const mediaObserverMock = {
      media$: of({ mqAlias: 'xs', mediaQuery: '' })
    };

    // setup component
    TestBed.configureTestingModule({
      declarations: [AdminComponent, HeaderComponent],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule],
      providers: [
        CookieService,
        ClockService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: MediaObserver, useValue: mediaObserverMock },
        { provide: NavMenuService, useValue: sideNavMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });
  it('should change menu orientation if screen size is small', () => {
    // assert
    expect(component.position).toEqual('side');
  });

  describe('menuClicked on a small screen device', () => {
    it('should call sideNav.close when clicked', () => {

      component.position = 'over';
      component.menuClicked(true);

      expect(component.sidenav.opened).toBeFalsy();
    });
  })
});
