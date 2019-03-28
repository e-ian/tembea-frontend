import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportTransfersComponent } from './airport-transfers.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AirportTransfersComponent', () => {
  let component: AirportTransfersComponent;
  let fixture: ComponentFixture<AirportTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportTransfersComponent ],
      imports: [ AppTestModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideTemplate(AirportTransfersComponent, `<div></div>`)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Airport Transfers component', () => {
    expect(component).toBeDefined();
  });
});
