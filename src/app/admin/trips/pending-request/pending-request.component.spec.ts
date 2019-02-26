import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PendingRequestComponent } from './pending-request.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ActivatedRouteMock } from '../../../__mocks__/activated.router.mock';
import { TripRequestService } from '../../__services__/trip-request.service';
import { tripRequestMock } from '../../__services__/__mocks__/trip-request.mock';
import { AppHeaderService } from '../../header/header.service';

describe('PendingRequestComponent Unit Test', () => {
  let component: PendingRequestComponent;
  let fixture: ComponentFixture<PendingRequestComponent>;
  let tripRequestService: TripRequestService;
  let headerService: AppHeaderService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteMock()
        }
      ]
    })
      .overrideTemplate(PendingRequestComponent, `<div></div>`)
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestComponent);
    component = fixture.componentInstance;
    tripRequestService = fixture.debugElement.injector.get(TripRequestService);
    headerService = fixture.debugElement.injector.get(AppHeaderService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    const trips = Object.assign({}, tripRequestMock);
    const pageInfo = {
      totalResults: 12,
    };
    jest.spyOn(headerService, 'updateBadgeSize');
    jest.spyOn(tripRequestService, 'query')
      .mockReturnValue(of({ trips: [trips], pageInfo }));
  });

  describe('ngOnInit', () => {
    it('should load all trip request', function () {
      const trips = Object.assign({}, tripRequestMock);
      const pageInfo = {
        totalResults: 12,
      };
      jest.spyOn(headerService, 'updateBadgeSize');
      jest.spyOn(tripRequestService, 'query')
        .mockReturnValue(of({ trips: [trips], pageInfo }));
      component.pageSize = 100;
      component.page = 1;

      component.ngOnInit();

      expect(tripRequestService.query).toHaveBeenCalledWith({ page: 1, size: 100, status: 'Approved' });
      expect(headerService.updateBadgeSize).toHaveBeenCalledWith(12);
    });
  });

  describe('updatePage', () => {
    it('should update page', function () {

      component.updatePage(123);

      expect(tripRequestService.query).toHaveBeenCalledWith({ page: 123, size: 20, status: 'Approved' });
      expect(headerService.updateBadgeSize).toHaveBeenCalledWith(12);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from activated route data', function () {
      jest.spyOn(component.routeData, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.routeData.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
