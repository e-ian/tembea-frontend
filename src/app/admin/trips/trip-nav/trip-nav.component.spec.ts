import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripNavComponent } from './trip-nav.component';
import {TripItineraryComponent} from '../trip-itinerary/trip-itinerary.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AngularMaterialModule} from '../../../angular-material.module';

describe('TripNavComponent', () => {
  let component: TripNavComponent;
  let fixture: ComponentFixture<TripNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripNavComponent, TripItineraryComponent ],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});