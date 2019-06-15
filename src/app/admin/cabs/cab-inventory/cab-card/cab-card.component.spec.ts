import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CabCardComponent } from './cab-card.component';
import { of } from 'rxjs';



describe('CabCardComponent', () => {
  let component: CabCardComponent;
  let fixture: ComponentFixture<CabCardComponent>;

  const emit = jest.fn();
  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        refresh: {
          subscribe: () => emit()
        }
      },
      afterClosed: () => of()
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabCardComponent ],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialog, useValue: matDialogMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('CabCardComponent', () => {
    it('should create cab card component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should open dialog successfully', () => {
      component.showCabDeleteModal();

      expect(matDialogMock.open).toBeCalledTimes(1);
      expect(emit).toBeCalledTimes(1);
    });

    it('should show more options', () => {
      jest.spyOn(component.showOptions, 'emit').mockImplementation();
      component.showMoreOptions();
      expect(component.showOptions.emit).toBeCalled();
    });

    it('should open edit dialog successfully', () => {
      jest.spyOn(matDialogMock, 'open');
      component.showCabEditModal();
      expect(matDialogMock.open).toHaveBeenCalled();
    });
  });
});
