import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { of } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { NavMenuService } from '../__services__/nav-menu.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from '../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../auth/__services__/clock.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { MatMenuModule, MatDialog } from '@angular/material';
import { toastrMock } from '../routes/__mocks__/create-route';
import { AlertService } from '../../shared/alert.service';
import { AuthService } from 'src/app/auth/__services__/auth.service';

class MockServices {
  public events = of(new NavigationEnd(0, '/', null));
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  beforeEach(async () => {
    const mockMatDialog = {
      open: () => { },
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, AdminComponent],
      imports: [
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule.withRoutes(
          [{ path: '', component: AdminComponent },
          {
            path: 'admin/trips/pending',
            component: AdminComponent,
            data: { title: 'Pending Trips' }
          }]),
        MatMenuModule
      ],
      providers: [
        CookieService,
        ClockService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: RouterModule, useClass: MockServices },
        { provide: AlertService, useValue: toastrMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('ngOnInit()', () => {
    it('should change header title', async () => {
      component.ngOnInit();
      await fixture.ngZone.run(async () => {
        const router = TestBed.get(Router);
        await router.navigate(['admin/trips/pending']);
        expect(component.headerTitle).toBe('Pending Trips');
      });
    });
  });

  // TODO: need to fix issue with mat-menu component
  describe('logout', () => {
    it('should test show logout function', () => {
      try {
        jest.spyOn(component.dialog, 'open').mockResolvedValue({});
        jest.spyOn(component.auth, 'getCurrentUser').mockResolvedValue({ firstName: 'Meshack' });
        component.ngOnInit();
        component.showLogoutModal();
        expect(component.dialog.open).toHaveBeenCalledTimes(1);
      } catch (error) {}
    });
    it.skip('should show logout modal on click logout button', fakeAsync(() => {
      // TODO: how to make a call to closed menu;
      // TODO: test open logout modal dialog modal
      const button = fixture.debugElement.nativeElement.querySelector('#drop-down-button');
      button.click();
      tick();
      const logout = fixture.debugElement.nativeElement.querySelector('#logout');
      logout.click();
    }));
  });
});

describe('HeaderComponent on xsmall devices', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async() => {
    const mediaObserverMock = {
      media$: of({ mqAlias: 'xs', mediaQuery: '' })
    };

    const navMenuServiceMock = {
      setSidenav: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
      toggle: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientModule, RouterTestingModule, AngularMaterialModule],
providers: [
        CookieService,
        ClockService,
        { provide: MediaObserver, useValue: mediaObserverMock },
        { provide: NavMenuService, useValue: navMenuServiceMock },
        { provide: AlertService, useValue: toastrMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should toggle sideNav on click', () => {
    const element = fixture.debugElement.query(By.css('#menuToggle'));
    jest.spyOn(component, 'toggleSideNav');

    element.triggerEventHandler('click', null);
    expect(component.toggleSideNav).toBeCalledTimes(1);
  });
});
