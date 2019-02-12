import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from './angular-material.module';
import {HttpClientModule} from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { HomeComponent } from './home/home.component';

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({ matches: true }))
});


Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({ matches: true }))
});

describe('AppComponent', () => {
  beforeEach(async(() => {
    const mockMatDialog = {
      open: () => {}
    };
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HomeComponent
      ],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
