import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { CreateRouteHelper } from '../create-route/create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import getRoutesResponseMock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { routesMock } from './__mocks__/route-inventory.mock';
import { AlertService } from '../../../shared/alert.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { ITEMS_PER_PAGE } from '../../../app.constants';

describe('RoutesInventoryComponent', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  let getRoutesSpy;
  const routeObject = {
    id: 1,
    destination: 'EPIC Tower',
    capacity: 1,
    name: 'Yaba',
    regNumber: 'JKD 839',
    takeOff: '12:00'
  };

  const createRouteHelperMock = {
    notifyUser: () => { }
  };

  const router = {
    navigate: () => { },
    events: { subscribe: jest.fn() }
  };

  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => {
    },
  };

  beforeEach(async () => {
    getRoutesSpy = jest.spyOn(RoutesInventoryService.prototype, 'getRoutes');
    getRoutesSpy.mockReturnValue(of(getRoutesResponseMock));

    TestBed.configureTestingModule({
      declarations: [
        RoutesInventoryComponent,
        EmptyPageComponent,
        ConfirmModalComponent,
        AppPaginationComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: AlertService, useValue: alert },
        { provide: CreateRouteHelper, useValue: createRouteHelperMock },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            data: {
              displayText: 'display data',
              confirmText: 'yes'
            }
          }
        },
        { provide: Router, useValue: router }
      ],
      imports: [ HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ConfirmModalComponent]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and render routes', async(() => {
    component.getRoutesInventory();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));

    expect(button.length).toEqual(1);
    expect(component.isLoading).toBe(false);
  }));

  it('should call getRoutes and return list of routes', async(() => {
    component.getRoutesInventory();
    fixture.detectChanges();

    expect(getRoutesSpy).toHaveBeenCalled();
    expect(component.routes).toEqual(getRoutesResponseMock.routes);

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(2);
  }));

  describe('getRoutesInventory', () => {
    it('should load all route', () => {
      const pageNo = 1;
      const sort = 'name,asc,batch,asc';
      const pageSize = ITEMS_PER_PAGE;

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);
      expect(getRoutesSpy).toHaveBeenCalledWith(pageSize, pageNo, sort);
    });
  });

  describe('ngOnInit', () => {
    it('should update and load page', (() => {
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

  describe('showCopyConfirmModal', () => {
    it('should open copy modal when copy icon is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
      component.getRoutesInventory();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.duplicate-icon'));
      buttons[0].triggerEventHandler('click', null);

      expect(dialogSpy).toBeCalledTimes(1);
    });
  });

  describe('Copy Route', () => {
    it('should duplicate a route when copy is successful', () => {
      const sendRequestToServer = jest.spyOn(component, 'sendRequestToServer').mockResolvedValue({});

      component.copyRoute(routeObject);

      expect(sendRequestToServer).toHaveBeenCalledWith(routeObject.id);
    });
  });

  describe('Send Request to Server', () => {
    it('should display a success message if copy request is successful', async () => {
      const response = { message: `Successfully duplicated ${routeObject.name} route`};
      const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
      const navigate = jest.spyOn(component.router, 'navigate');
      const routeService = jest.spyOn(component.routeService, 'createRoute')
        .mockReturnValue(response);

      await component.sendRequestToServer(routeObject.id);

      expect(routeService).toHaveBeenCalledWith(routeObject.id, true);
      expect(notifyUser).toHaveBeenCalledWith(['Successfully duplicated Yaba route'], 'success');
      expect(navigate).toHaveBeenCalledWith(['/admin/routes/inventory']);
    });

    it('should display an error message if request is unsuccessful', async () => {
      const response = { error: { message: 'some server error' } };
      const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
      const navigate = jest.spyOn(component.router, 'navigate');
      const routeService = jest.spyOn(component.routeService, 'createRoute')
        .mockRejectedValue(response);

      await component.sendRequestToServer(routeObject.id);

      expect(routeService).toHaveBeenCalledWith(routeObject.id, true);
      expect(notifyUser).toHaveBeenCalledWith([response.error.message]);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('Change Route Status', () => {
    let changeStatusSpy;

    beforeEach(() => {
      changeStatusSpy = jest.spyOn(RoutesInventoryService.prototype, 'changeRouteStatus');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should call the method to update routes data', () => {
      const statusMock = { success: true };
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      changeStatusSpy.mockReturnValue(of(statusMock));

      component.changeRouteStatus(1, 'Active');
      expect(changeStatusSpy).toHaveBeenCalledTimes(1);
      expect(changeStatusSpy).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).toHaveBeenCalledTimes(1);
      expect(component.updateRoutesData).toHaveBeenCalledWith(1, 'Active');
    });

    it('should call the method to update routes data and catch all errors', () => {
      const errorMock = new Error();
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      changeStatusSpy.mockReturnValue(throwError(errorMock));

      component.changeRouteStatus(1, 'Active');
      expect(changeStatusSpy).toHaveBeenCalledTimes(1);
      expect(changeStatusSpy).toHaveBeenCalledWith(1, { status: 'Active' });
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

  describe('showDeleteModal', () => {
    it('should open delete modal when delete icon is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');

      component.getRoutesInventory();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.decline-icon'));
      buttons[0].triggerEventHandler('click', null);
      expect(dialogSpy).toBeCalledTimes(1);
    });
  });

  describe('deleteRoute', () => {
    let deleteSpy;

    beforeEach(() => {
      deleteSpy = jest.spyOn(RoutesInventoryService.prototype, 'deleteRouteBatch');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should delete a route batch on success response from http call', () => {
      deleteSpy.mockReturnValue(of({
        success: true,
        message: 'batch deleted successfully'
      }));

      component.getRoutesInventory();
      fixture.detectChanges();

      component.deleteRoute(1, 1);

      expect(deleteSpy).toHaveBeenCalled();
      expect(alert.success).toBeCalledWith('batch deleted successfully');
      expect(component.routes.length).toBe(4);
    });

    it('should show error alert route batch on failed response from http call', () => {
      deleteSpy.mockReturnValue(of({
        success: false,
        message: 'something went wrong'
      }));

      component.getRoutesInventory();
      fixture.detectChanges();
      component.deleteRoute(1, 1);

      expect(deleteSpy).toHaveBeenCalled();
      expect(alert.error).toBeCalledWith('something went wrong');
      expect(component.routes.length).toBe(5);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions on ngOnDestroy', () => {
      component.updateSubscription = {
        unsubscribe: jest.fn()
      }
      component.navigationSubscription = {
        unsubscribe: jest.fn()
      }
      component.ngOnDestroy();

      expect(component.updateSubscription.unsubscribe).toBeCalledTimes(1);
      expect(component.navigationSubscription.unsubscribe).toBeCalledTimes(1);
    })
  })
});
