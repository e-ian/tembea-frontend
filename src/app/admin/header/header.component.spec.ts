import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { of } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { NavMenuService } from '../__services__/nav-menu.service';
describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [AngularMaterialModule]
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
                AngularMaterialModule,
            ],
            providers: [
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
