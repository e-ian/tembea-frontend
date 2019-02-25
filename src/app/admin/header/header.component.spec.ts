import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { Toastr, TOASTR_TOKEN } from '../../shared/toastr.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';

const toastr: Toastr = window['toastr'];

class MockServices {
  public events = of( new NavigationEnd(0, '/', null));
}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent, AdminComponent],
            imports: [
              AngularMaterialModule,
              HttpClientModule,
              RouterTestingModule.withRoutes([
                { path: '', component: AdminComponent },
                { path: 'admin/trips/pending', component: AdminComponent, data: { title: 'Pending Trips'} },
              ]),
            ],
          providers: [
            CookieService,
            ClockService,
            { provide: TOASTR_TOKEN, useValue: toastr },
            { provide: RouterModule, useClass: MockServices },
          ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
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
          // expect(component.activeRoute).toEqual('');
          const router = TestBed.get(Router);

          await router.navigate(['admin/trips/pending']);
          expect(component.headerTitle).toBe('Pending Trips');
        });
      });
    });
});

describe('HeaderComponent on xsmall devices', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(() => {
        // create mock
        const mediaObserverMock = {
            media$: of({ mqAlias: 'xs', mediaQuery: '' })
        };

        const navMenuServiceMock = {
            setSidenav: jest.fn(),
            open: jest.fn(),
            close: jest.fn(),
            toggle: jest.fn(),
        };

        // setup component
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [
              HttpClientModule,
              RouterTestingModule,
              AngularMaterialModule,
            ],
            providers: [
              CookieService,
              ClockService,
              { provide: TOASTR_TOKEN, useValue: toastr },
                { provide: MediaObserver, useValue: mediaObserverMock },
                { provide: NavMenuService, useValue: navMenuServiceMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    });

    it('should toggle sideNav on click', () => {
        const elemement = fixture.debugElement.query(By.css('#menuToggle'));
        jest.spyOn(component, 'toggleSideNav');

        elemement.triggerEventHandler('click', null);
        expect(component.toggleSideNav).toBeCalledTimes(1);
    });

});
