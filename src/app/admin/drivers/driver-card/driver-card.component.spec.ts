import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DriverCardComponent } from './driver-card.component';

describe('DriverCardComponent', () => {
  let component: DriverCardComponent;
  let fixture: ComponentFixture<DriverCardComponent>;

  const emit = jest.fn();
  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        refresh: {
          subscribe: () => emit()
        }
      },
      afterClosed: jest.fn().mockReturnValue(
        of({
          subscribe: () => emit()
        })
      )
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverCardComponent ],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialog, useValue: matDialogMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.showOptions.emit).toBeCalled();
  });
  it('should open dialog successfully', () => {
    component.showDeleteModal();
    expect(matDialogMock.open).toBeCalledTimes(1);
  });
  it('should create subscription to Modal closing event" ', () => {
    component.showDeleteModal();
    expect(component.dialogRef).toBeDefined();
    expect(component.dialogRef.afterClosed).toHaveBeenCalled();
    component.dialogRef.afterClosed().subscribe(() => {
      expect(component.refreshWindow.emit).toHaveBeenCalled();
    });
  });
});
