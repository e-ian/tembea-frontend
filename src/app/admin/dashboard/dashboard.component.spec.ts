import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { RouteUsageService } from '../__services__/route-usage.service';
import routeUsageMock from '../__services__/__mocks__/routeUsageMock';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { RouteRatingsOverviewComponent } from './route-ratings-overview/route-ratings-overview.component';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { mockRouteRatings } from './route-ratings-overview/ratingsMockData';
import { DashboardComponent } from './dashboard.component';
import { RoutesOverviewComponent } from './routes-overview/routes-overview.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { AverageTripRatingsComponent } from './average-trip-ratings/average-trip-ratings.component';
import { TripRatingsService } from '../__services__/trip-ratings.service';
import { tripsMock } from 'src/app/__mocks__/trips.mock';


export const routeRatingServiceMock = {
  getRouteAverages: jest.fn(),
};

export const averageTripRatingServiceMock = {
  getTripData: jest.fn().mockReturnValue(of(tripsMock)),
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const service = {
    getRouteUsage: jest.fn().mockReturnValue(of(true)),
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [DashboardComponent, RoutesOverviewComponent, DatePickerComponent,
        RouteRatingsOverviewComponent, RatingStarsComponent, AverageTripRatingsComponent],
      imports: [AngularMaterialModule, FormsModule, MatNativeDateModule],
      providers: [{ provide: RouteUsageService, useValue: service },
      { provide: RouteRatingsService, useValue: routeRatingServiceMock },
      { provide: TripRatingsService, useValue: averageTripRatingServiceMock }
      ]
    })
      .compileComponents();
  })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an object containing both mostUsedBatch and leastUsedBatch', () => {
    service.getRouteUsage.mockReturnValue(of(routeUsageMock));

    component.getRoutesUsage();
    expect(component.mostUsedRoute).toEqual({
      Route: 'Pangani',
      RouteBatch: 'A',
      percentageUsage: 100
    });
  });

  it('should set date filters and call getRoutesUsage()', () => {

    const routesUsage = jest.spyOn(component, 'getRoutesUsage')
      .mockImplementation(jest.fn());
    jest.spyOn(component, 'getRouteRatings').mockImplementationOnce(jest.fn);

    component.setDateFilter('from', 'from', '2019-05-03');

    expect(routesUsage).toBeCalledTimes(1);
    expect(component.dateFilters.from).toEqual({ from: '2019-05-03' });
  });

  describe('getRouteRatings', () => {
    let getRouteRatingsSpy;
    beforeEach(() => {
      getRouteRatingsSpy = jest.spyOn(component, 'getRouteRatings');
    });

    it('should call getRouteRating on ngOnInit', () => {
      getRouteRatingsSpy.mockImplementationOnce(() => jest.fn());
      component.ngOnInit();
      expect(component.getRouteRatings).toHaveBeenCalled();
    });

    it('should call getRouteRatings on setDateFilter', () => {
      getRouteRatingsSpy.mockImplementationOnce(() => jest.fn());
      component.setDateFilter('from', 'from', '2019-05-03');
      expect(component.getRouteRatings).toHaveBeenCalled();
    });

    it('should call routeRating service and set route ratings', () => {
      const res = {
        success: true,
        message: 'Ratings fetched successfully',
        data: mockRouteRatings
      };
      jest.spyOn(routeRatingServiceMock, 'getRouteAverages').mockReturnValue(of(res));
      component.getRouteRatings();
      expect(routeRatingServiceMock.getRouteAverages).toHaveBeenCalled();
      expect(component.mostRatedRoutes).toEqual(res.data.slice(0, 3));
      expect(component.leastRatedRoutes).toEqual(res.data.slice(0, 3));
    });
  });

  describe('get trip data', () => {
    let getRouteRatingsSpy;
    beforeEach(() => {
      getRouteRatingsSpy = jest.spyOn(component, 'getRouteRatings');
    });

    it('should call getRouteRating on ngOnInit', () => {
      getRouteRatingsSpy.mockImplementationOnce(() => jest.fn());
      jest.spyOn(component, 'tripAverageRating');
      component.ngOnInit();
      expect(component.tripAverageRating).toHaveBeenCalled();
    });

    it('Should call the average rating of zero upon calling the calculateAverage method', () => {
      component.calculateAverage([]);
      expect(component.averageRatings).toBeLessThanOrEqual(0);
    });
  });
});
