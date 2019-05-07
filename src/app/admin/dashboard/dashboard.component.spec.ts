import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RoutesOverviewComponent } from './routes-overview/routes-overview.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { RouteUsageService } from '../__services__/route-usage.service';
import { environment } from 'src/environments/environment';
import routeUsageMock from '../__services__/__mocks__/routeUsageMock';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const service = {
    getRouteUsage: jest.fn().mockReturnValue(of(true)),
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ DashboardComponent, RoutesOverviewComponent, DatePickerComponent ],
      imports: [ AngularMaterialModule, FormsModule, MatNativeDateModule ],
      providers: [{ provide: RouteUsageService, useValue: service }]
    })
    .compileComponents();
  }));

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

    component.setDateFilter('from', 'startDate', '2019-05-03');

    expect(routesUsage).toBeCalledTimes(1);
    expect(component.dateFilters.from).toEqual({startDate: '2019-05-03'})
  });
});
