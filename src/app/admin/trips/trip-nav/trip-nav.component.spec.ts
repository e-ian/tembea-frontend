import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TripNavComponent } from './trip-nav.component';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../__tests__/testing.module';


describe('TripNavComponent', () => {
  let component: TripNavComponent;
  let fixture: ComponentFixture<TripNavComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ TripNavComponent, ShortenNamePipe, TripItineraryComponent ],
      imports: [HttpClientTestingModule, AppTestModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideTemplate(TripNavComponent, `<div></div>`)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
