import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripItineraryComponent } from './trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {EmptyPageComponent} from '../../empty-page/empty-page.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {TripRequestService} from '../../__services__/trip-request.service';
import {tripRequestMock} from '../../../shared/__mocks__/trip-request.mock';
import {department} from '../../../shared/__mocks__/department.mock';
import { AppTestModule } from '../../../__tests__/testing.module';

describe('TripItineraryComponent', () => {
  let component: TripItineraryComponent;
  let tripRequestService: TripRequestService;
  let fixture: ComponentFixture<TripItineraryComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ TripItineraryComponent, ShortenNamePipe, EmptyPageComponent],
      imports: [HttpClientTestingModule, AppTestModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideTemplate(TripItineraryComponent, `<div></div>`)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripItineraryComponent);
    component = fixture.componentInstance;
    tripRequestService = fixture.debugElement.injector.get(TripRequestService);
    fixture.detectChanges();
  });

  beforeEach(() => {
    const trips = Object.assign({}, tripRequestMock);
    const pageInfo = {
      totalResults: 12,
    };
    jest.spyOn(tripRequestService, 'getDepartments').mockReturnValue(of(department));
    jest.spyOn(tripRequestService, 'query')
      .mockReturnValue(of({ trips: [trips], pageInfo }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create TripItineraryComponent', () => {
    expect(component).toBeTruthy();
  });


 describe('ngOnInit', () => {
   it('should get trips and department', () => {
     component.ngOnInit();

      expect(tripRequestService.query).toHaveBeenCalled();
      expect(tripRequestService.getDepartments).toHaveBeenCalled();
    });
  });

  describe('updatePage', () => {
    it('should get trips and department', () => {
      jest.spyOn(component, 'getTrips');

      const page = 3;
      component.updatePage(page);

      expect(component.getTrips).toHaveBeenCalled();
    });
  });
});
