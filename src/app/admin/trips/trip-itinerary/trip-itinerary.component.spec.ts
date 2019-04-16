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

  describe('setDateFilter', () => {
    it('should set date filters and call getTrips()', () => {
      const getTripsSpy = jest.spyOn(component, 'getTrips')
      .mockImplementation(jest.fn());

      component.setDateFilter('requestedOn', 'before', '2019-03-03');

      expect(getTripsSpy).toBeCalledTimes(1);
      expect(component.dateFilters.requestedOn).toEqual({before: '2019-03-03'})
    })

    it('should return empty date if date is lower than current date', () => {
      component.tripRequestType = 'Upcoming Trips';
      const getTripsSpy = jest.spyOn(component, 'getTrips')
      .mockImplementation(jest.fn());
      component.setDateFilter('requestedOn', 'before', '2018-03-03');

      expect(getTripsSpy).toBeCalledTimes(1);
      expect(component.dateFilters.requestedOn).toEqual({})
    })
  });

  describe('setFilterParams', () => {
    it('should set filter parameters for exporting tables', () => {
      component.departmentName = 'routes';
      component.dateFilters = {
        requestedOn: '2022-12-21',
        departureTime: '2023-12-21'
      };

      component.setFilterParams();

      expect(component.filterParams).toEqual({
        department: 'routes',
        dateFilters: {
          requestedOn: '2022-12-21', departureTime: '2023-12-21'
        }
      })
    })
  });

  describe('departmentSelected', () => {
    it('fires event when department is selected', () => {
      const getTripsSpy = jest.spyOn(component, 'getTrips');
      component.departmentSelected('(click)');
      expect(component.departmentName).toEqual('(click)');
      expect(getTripsSpy).toHaveBeenCalled()
    });
  });

  describe('Up Coming Trips', () => {
    it('should set passdParams to fit up coming query', () => {
      component.tripRequestType = 'Upcoming Trips';
      component.getTrips();
      const params = {
        page: 1,
        size: 20,
        status: 'Confirmed',
        department: undefined,
        type: 'Regular Trip',
        dateFilters: {departureTime: {}, requestedOn: {} },
        currentDay: 'Call Current date'
      }
      expect(component.passedParams).toEqual(params);
    });
  })
});
