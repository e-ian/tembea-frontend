import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteApproveDeclineModalComponent } from './route-approve-decline-modal.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouteRequestService } from '../../__services__/route-request.service';

describe('RouteApproveDeclineModalComponent', () => {
  let component: RouteApproveDeclineModalComponent;
  let fixture: ComponentFixture<RouteApproveDeclineModalComponent>;

  const mockAuthService = {
    getCurrentUser: () => ({ firstName: 'Tester' })
  };
  const mockMatDialogRef = {
    close: () => {},
  };
  const mockRouteService = {
    declineRequest: () => {}
  };
  const mockMatDialogData = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ RouteApproveDeclineModalComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: RouteRequestService, useValue: mockRouteService },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteApproveDeclineModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  describe('Initial load', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  })

  describe('closeDialog', () => {
    it('should call dialogRef.close()', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('decline', () => {
    it('should change loading to true', () => {
      component.decline({ comment: 'This route is beyond our acceptable limit'});

      expect(component.loading).toBe(true);
    });
  })
});
