import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialog} from '@angular/material';
import { ProviderCardComponent } from './provider-card.component';
import { of } from 'rxjs';

const matDialogMock = {
  open: jest.fn().mockReturnValue({
    componentInstance: {
      executeFunction: {
        subscribe: () => jest.fn()
      }
    },
    afterClosed: () => of()
  }),
};
describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCardComponent ],
      providers: [{provide: MatDialog, useValue: matDialogMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.hidden).toBe(true);
    expect(component.showOptions.emit).toBeCalled();
  });

  it('should open edit modal', () => {
    jest.spyOn(matDialogMock, 'open');
    component.openEditModal();
    expect(matDialogMock.open).toHaveBeenCalled()
  })
});
