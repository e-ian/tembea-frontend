import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { TripApproveDeclineModalComponent } from './trip-approve-decline-modal.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ReturnExistingCabsComponent } from './return-existing-cabs/return-existing-cabs.component';


fdescribe('TripApproveDeclineModalComponent', () => {
  let component: TripApproveDeclineModalComponent;
  let fixture: ComponentFixture<TripApproveDeclineModalComponent>;
  let injector: Injector;
  let authService: any;
  let tripRequestService: any;
  const mockMatDialogData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AppTestModule, AngularMaterialModule],
      declarations: [TripApproveDeclineModalComponent, ReturnExistingCabsComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripApproveDeclineModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    tripRequestService = injector.get(TripRequestService);
    authService = injector.get(AuthService);
  });

  beforeEach(() => {
    injector = fixture.debugElement.injector;
    const mockMatDialogRef: any = injector.get(MatDialogRef);
    const appEventService = injector.get(AppEventService);

    mockMatDialogRef.close.mockReturnValue({});

    jest.spyOn(tripRequestService, 'confirmRequest').mockReturnValue(of({}));
    jest.spyOn(authService, 'getCurrentUser').mockReturnValue({ email: '', firstName: '' });
    jest.spyOn(tripRequestService, 'declineRequest').mockReturnValue(of({}));
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

  describe('closeDialog', () => {
    it('should call dialogRef.close()', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('Confirm', () => {
    it('should change loading to true', () => {
      // @ts-ignore
      const values = {
        driverName: 'Jack',
        driverPhoneNo: '0908377848383',
        regNumber: 'HJD 345',
        comment: 'This trip is acceptable'
      }
      const appEventService = injector.get(AppEventService);

      component.confirm(values);

      expect(component.loading).toBe(true);
      expect(tripRequestService.confirmRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });

  describe('decline', () => {
    it('should change loading to true', () => {
      // @ts-ignore
      component.account = { email: 'AAA.BBB@CCC.DDD', firstName: 'Vic' };
      const appEventService = injector.get(AppEventService);

      component.decline({ comment: 'This trip is not acceptable' });

      expect(component.loading).toBe(true);
      expect(tripRequestService.declineRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });
  describe('clearFields', () => {
    it('should reset input fileds to empty when cab model(input) is empty', () => {
      component.confirmForm = { form: { patchValue: jest.fn() } };
      const event = { target: { value: '' } };

      component.clearFields(event);

      expect(component.disableOtherInput).toEqual(false);
      expect(component.confirmForm.form.patchValue).toBeCalledTimes(1);
    });
  });
  describe('clickedCabs', () => {
    it('should patch the input fields of the form once a cab has been clicked', () => {
      const event = { click: { cabRegNumber: 'UBE234A', cabModel: 'Toyota'} }
      component.confirmForm = { form: { patchValue: jest.fn() } };

      component.clickedCabs(event);

      expect(component.disableOtherInput).toEqual(true);
      expect(component.confirmForm.form.patchValue).toBeCalledTimes(1);
    });
  });
});
