import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteApproveDeclineModalComponent } from './route-approve-decline-modal.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AuthService } from '../../../auth/__services__/auth.service';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AlertService } from '../../../shared/alert.service';

describe('RouteApproveDeclineModalComponent', () => {
  let component: RouteApproveDeclineModalComponent;
  let fixture: ComponentFixture<RouteApproveDeclineModalComponent>;
  let authService: any;
  let routeService: RouteRequestService;
  const mockMatDialogData = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AppTestModule],
      declarations: [RouteApproveDeclineModalComponent],
      providers: [
        AlertService,
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteApproveDeclineModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    routeService = fixture.debugElement.injector.get(RouteRequestService);
    authService = fixture.debugElement.injector.get(AuthService);
  });

  beforeEach(() => {
    authService.getCurrentUser.mockImplementation(() => ({ firstName: 'Tester' }));
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

  describe('closeDialog', () => {
    it('should call dialogRef.close()', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('decline', () => {
    it('should change loading to true', () => {
      jest.spyOn(routeService, 'declineRequest').mockImplementation();
      component.decline({ comment: 'This route is beyond our acceptable limit' });

      expect(routeService.declineRequest).toHaveBeenCalledTimes(1);
      expect(component.loading).toBe(true);
    });
  });

  describe('approve', () => {
    it('should change loading to true', () => {
      jest.spyOn(routeService, 'approveRequest').mockImplementation();
      component.approve({
        routeName: 'This route is beyond our acceptable limit',
        takeOff: '',
        cabRegNumber: '',
        capacity: ''
      });

      expect(routeService.approveRequest).toHaveBeenCalledTimes(1);
      expect(component.loading).toBe(true);
    });
  });
});
