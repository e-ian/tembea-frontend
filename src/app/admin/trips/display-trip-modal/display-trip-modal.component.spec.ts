import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTripModalComponent } from './display-trip-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';

describe('DisplayTripModalComponent', () => {
  let component: DisplayTripModalComponent;
  let fixture: ComponentFixture<DisplayTripModalComponent>;
  const mockMatDialogData = {
    tripInfo: {
      distance: '12 km',
      requester: {
        name: 'sdfe'
      },
      rider: {
        name: 'sfdddsa'
      },
      pickup: 'asd',
      destination: 'afsd',
      department: 'safd'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTripModalComponent ],
      imports: [AppTestModule, AngularMaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
