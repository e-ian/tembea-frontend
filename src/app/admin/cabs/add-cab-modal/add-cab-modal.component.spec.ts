import { AddCabsModalComponent } from './add-cab-modal.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of, Observable, throwError } from 'rxjs';

import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { responseMock, MockError } from './__mocks__/add-cabs-mock';


describe('AddCabsModalComponent', () => {
    let component: AddCabsModalComponent;
    let fixture: ComponentFixture<AddCabsModalComponent>;

    const mockCabsInventoryService = {
        addCab: jest.fn()
    };

    const mockMatDialogRef = {
        close: () => {},
    };

    const mockAlert = {
        success: jest.fn(),
        error: jest.fn()
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddCabsModalComponent ],
            imports: [FormsModule],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: CabsInventoryService, useValue: mockCabsInventoryService },
                { provide: AlertService, useValue: mockAlert },
                { provide: MAT_DIALOG_DATA, useValue: {} },

            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddCabsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('initial load', () => {
        it('should create component', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('closeDialog', () => {
        it('should close the dialog', () => {
            jest.spyOn(component.dialogRef, 'close');
            component.closeDialog();
            expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
        });
    });

    describe('addCab', () => {
        it('should call cabService.addCab', () => {
            mockCabsInventoryService.addCab.mockReturnValue(of(responseMock));
            component.addCab();
            expect(component.cabService.addCab).toHaveBeenCalledTimes(1);
        });

        it('should call alert.success when request succed', () => {
            mockCabsInventoryService.addCab.mockReturnValue(of(responseMock));
            jest.spyOn(component.alert, 'success');
            component.addCab();
            expect(component.alert.success).toHaveBeenCalledTimes(1);
        });

        it('should call alert.error when request fail with 409 conflict', () => {
            const error = new MockError(409, 'A cab with the registration or phone number already exists');
            mockCabsInventoryService.addCab.mockReturnValue(throwError(error));
            jest.spyOn(component.alert, 'error');
            component.addCab();
            expect(component.alert.error).toHaveBeenCalledTimes(1);
            expect(component.alert.error).toHaveBeenCalledWith('A cab with the registration or phone number already exists');
        });
    });
});
