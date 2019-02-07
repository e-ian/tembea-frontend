import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutModalComponent } from './logout-modal.component';
import { AuthService } from '../../auth/__services__/auth.service';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { mockRouter } from 'src/app/shared/__mocks__/mockData';

describe('LogoutModalComponent', () => {
  let fixture: ComponentFixture<LogoutModalComponent>;
  let element: HTMLElement;
  let component: LogoutModalComponent;

  const mockAuthService = {
    getCurrentUser: () => {
      return ({
        firstName: 'John'
      });
    },
    logout: () => {}
  };
  const mockMatDialogRef = {
    close: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutModalComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe('initial load', () => {
    it('should have correct message', () => {
      expect(element.querySelector('p').textContent).toContain('Hi John, are you sure you want to logout?');
    });
  });

  describe('functionality', () => {
    it('should close the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should run the logout', () => {
      jest.spyOn(component.dialogRef, 'close');
      jest.spyOn(component.router, 'navigate');
      component.logout();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(component.router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
