import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import getRoutesResponseMock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { throwError } from 'rxjs';
import { routesMock } from './__mocks__/route-inventory.mock';
import { AlertService } from '../../../shared/alert.service';

describe.skip('RoutesInventoryComponent', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  const service = {
    getRoutes: jest.fn().mockReturnValue(of(getRoutesResponseMock)),
    changeRouteStatus: jest.fn()
  };
  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoutesInventoryComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        {
          provide: AlertService, useValue: alert
        },
        {
          provide : RoutesInventoryService, useValue: service
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and render routes', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));
    expect(button.length).toEqual(1);
  }));

  it('should call getRoutes and return list of routes', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();

    expect(service.getRoutes).toHaveBeenCalled();
    expect(component.routes).toEqual(getRoutesResponseMock.routes);

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(1);
  }));

  it('should change page upon clicking page number', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    jest.spyOn(component, 'setPage');

    const button = fixture.debugElement.queryAll(By.css('.page-number'));
    button[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.setPage).toHaveBeenCalled();
  }));

  it('should navigate to the next group of pages', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    jest.spyOn(component, 'nextGroup');

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(1);
    expect(fixture.componentInstance.currentPageGroup).toEqual(0);

    button[0].triggerEventHandler('click', null);
    expect(component.nextGroup).toHaveBeenCalled();
    fixture.detectChanges();
  }));

  it('should change the current page group', async(() => {
    component.nextGroup();
    fixture.detectChanges();
    expect(component.currentPageGroup).toEqual(1);
  }));

  it('should change the current page group to previous', async(() => {
    const currentGroup = component.currentPageGroup;
    component.prevGroup();
    fixture.detectChanges();
    expect(component.currentPageGroup).toEqual(currentGroup - 1);
  }));

  it('should set page', async(() => {
    jest.spyOn(service, 'getRoutes');
    jest.spyOn(component, 'getRoutesInventory');

    expect(component.pageNo).toEqual(1);

    component.setPage(20);
    fixture.detectChanges();
    expect(component.pageNo).toEqual(20);
    expect(component.getRoutesInventory).toHaveBeenCalled();
  }));

  describe('Change Route Status', () => {
    it('should call the method to update routes data', () => {
      const statusMock = { success: true };
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      jest.spyOn(service, 'changeRouteStatus').mockReturnValue(of(statusMock));

      component.changeRouteStatus(1, 'Active');
      expect(service.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(service.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).toHaveBeenCalledTimes(1);
      expect(component.updateRoutesData).toHaveBeenCalledWith(1, 'Active');
    });

    it('should call the method to update routes data and catch all errors', () => {
      const errorMock = new Error();
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      jest.spyOn(service, 'changeRouteStatus').mockReturnValue(throwError(errorMock));

      component.changeRouteStatus(1, 'Active');
      expect(service.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(service.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).not.toHaveBeenCalled();
      expect(alert.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('update routes data', () => {
    it('should return the updated routes ', () => {
      component.routes = routesMock

      component.updateRoutesData(1, 'Active');
      expect(component.routes).not.toEqual(routesMock);
      expect(component.routes[0].status).toEqual('Active');
    });
  });
});
