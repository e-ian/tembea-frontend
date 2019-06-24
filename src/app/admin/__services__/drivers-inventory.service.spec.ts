import { DriversInventoryService } from './drivers-inventory.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import getDriversResponseMock from '../../__mocks__/drivers.mock';
import {BaseInventoryModel} from '../../shared/models/base.model';

describe('DriverInventoryService', () => {
  let injector: TestBed;
  let service: DriversInventoryService;
  let httpMock: HttpTestingController;
  const getDriversResponse = getDriversResponseMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(DriversInventoryService);
    httpMock = injector.get(HttpClientTestingModule);
  });

  describe('getCabs', () => {
    it('should get all Drivers', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'get');
      httpSpy.mockReturnValue(of(getDriversResponse));
      let drivers;
      const result = service.get(2, 2, 'name,asc,batch,asc', 1);
      result.subscribe(value => {
        drivers = value;
        expect(drivers).toEqual(getDriversResponseMock.drivers);
      });
    });
  });
});
