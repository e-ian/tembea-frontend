import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteApproveDeclineModalComponent } from './route-approve-decline-modal.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouteRequestService } from '../../__services__/route-request.service';

import { AppTestModule } from '../../../__tests__/testing.module';
import { of } from 'rxjs';
import { Injector } from '@angular/core';
import { AppEventService } from '../../../shared/app-events.service';

describe('RouteApproveDeclineModalComponent', () => {
  let component: RouteApproveDeclineModalComponent;
  let fixture: ComponentFixture<RouteApproveDeclineModalComponent>;
  let injector: Injector;
  let authService: any;
  let routeService: any;
  const mockMatDialogData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AppTestModule],
      declarations: [RouteApproveDeclineModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteApproveDeclineModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    routeService = injector.get(RouteRequestService);
    authService = injector.get(AuthService);
  });

  beforeEach(() => {
    injector = fixture.debugElement.injector;
    const mockMatDialogRef: any = injector.get(MatDialogRef);
    const appEventService = injector.get(AppEventService);

    mockMatDialogRef.close.mockReturnValue({});

    jest.spyOn(authService, 'getCurrentUser').mockReturnValue({ email: '' });
    jest.spyOn(routeService, 'declineRequest').mockReturnValue(of({}));
    jest.spyOn(routeService, 'approveRequest').mockReturnValue(of({}));
    jest.spyOn(appEventService, 'broadcast').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('Initial load', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Initial load', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('closeDialog', () => {
    it('should call dialogRef.close()', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('decline', () => {
    it('should change loading to true', () => {
      // @ts-ignore
      component.account = { email: 'AAA.BBB@CCC.DDD' };
      const appEventService = injector.get(AppEventService);

      component.decline({ comment: 'This route is beyond our acceptable limit' });

      expect(component.loading).toBe(true);
      expect(routeService.declineRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });

  describe('approve', () => {
    it('should change loading to true', () => {
      // @ts-ignore
      component.account = { email: 'AAA.BBB@CCC.DDD' };
      const appEventService = injector.get(AppEventService);

      component.approve({
        routeName: 'This route is beyond our acceptable limit',
        takeOff: '',
        cabRegNumber: '',
        capacity: ''
      });

      expect(component.loading).toBe(true);
      expect(routeService.approveRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });
});
