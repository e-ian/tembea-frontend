import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';

import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import mock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { routesMock } from './__mocks__/route-inventory.mock';
import { RouteInventoryModel } from '../../../shared/models/route-inventory.model';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';

describe('RoutesInventoryComponent Unit Test', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  let routeService: RoutesInventoryService;
  const getRoutesResponseMock: RouteInventoryModel = new RouteInventoryModel().deserialize(mock);
  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [RoutesInventoryComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        {
          provide: AlertService, useValue: alert
        },
      ]
    })
      .overrideTemplate(RoutesInventoryComponent, `<div></div>`)
      .compileComponents();

    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    routeService = fixture.debugElement.injector.get(RoutesInventoryService);
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('getRoutesInventory', () => {
    beforeEach(() => {
      jest.spyOn(routeService, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    });
    it('should load all route', (() => {
      const pageNo = 1;
      const sort = 'name,asc,batch,asc';
      const pageSize = ITEMS_PER_PAGE;

      jest.spyOn(routeService, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);
      expect(routeService.getRoutes).toHaveBeenCalledWith(pageSize, pageNo, sort);
    }));
  });

  describe('ngOnInit', () => {
    it('should update and load page', (() => {
      jest.spyOn(routeService, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
      jest.spyOn(component, 'getRoutesInventory');

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);
      expect(component.getRoutesInventory).toHaveBeenCalled();
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getRoutesInventory');

      expect(component.pageNo).toEqual(1);

      component.setPage(20);
      fixture.detectChanges();
      expect(component.pageNo).toEqual(20);
      expect(component.getRoutesInventory).toHaveBeenCalled();
    }));
  });

  describe('Change Route Status', () => {
    it('should call the method to update routes data', () => {
      const statusMock = { success: true };
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      jest.spyOn(routeService, 'changeRouteStatus').mockReturnValue(of(statusMock));

      component.changeRouteStatus(1, 'Active');
      expect(routeService.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(routeService.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).toHaveBeenCalledTimes(1);
      expect(component.updateRoutesData).toHaveBeenCalledWith(1, 'Active');
    });

    it('should call the method to update routes data and catch all errors', () => {
      const errorMock = new Error();
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      jest.spyOn(routeService, 'changeRouteStatus').mockReturnValue(throwError(errorMock));

      component.changeRouteStatus(1, 'Active');
      expect(routeService.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(routeService.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).not.toHaveBeenCalled();
      expect(alert.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('update routes data', () => {
    it('should return the updated routes ', () => {
      component.routes = routesMock;

      component.updateRoutesData(1, 'Active');
      expect(component.routes).not.toEqual(routesMock);
      expect(component.routes[0].status).toEqual('Active');
    });
  });
});

describe('RoutesInventoryComponent Integration Test', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  let routeService: RoutesInventoryService;
  const getRoutesResponseMock: RouteInventoryModel = new RouteInventoryModel().deserialize(mock);
  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppPaginationComponent, RoutesInventoryComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        {
          provide: AlertService, useValue: alert
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    routeService = fixture.debugElement.injector.get(RoutesInventoryService);
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });
});
