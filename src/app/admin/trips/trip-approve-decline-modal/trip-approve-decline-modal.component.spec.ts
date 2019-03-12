
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TripRequestService } from '../../__services__/trip-request.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { TripApproveDeclineModalComponent } from './trip-approve-decline-modal.component';

describe('TripApproveDeclineModalComponent', () => {
  let component: TripApproveDeclineModalComponent;
  let fixture: ComponentFixture<TripApproveDeclineModalComponent>;
  let injector: Injector;
  let tripRequestService: any;
  const mockMatDialogData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AppTestModule],
      declarations: [TripApproveDeclineModalComponent],
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
  });

  beforeEach(() => {
    injector = fixture.debugElement.injector;
    const mockMatDialogRef: any = injector.get(MatDialogRef);
    const appEventService = injector.get(AppEventService);

    mockMatDialogRef.close.mockReturnValue({});

    jest.spyOn(tripRequestService, 'confirmRequest').mockReturnValue(of({}));
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
});
