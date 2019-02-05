import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { RoutesInventoryService } from '../routes-inventory.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import getRoutesResponseMock from '../../routes/routes-inventory/__mocks__/get-routes-response.mock';

describe('RoutesInventoryService', () => {
  let service: RoutesInventoryService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoutesInventoryService],
    })
  );

  beforeEach(inject([RoutesInventoryService, HttpTestingController], (_service, _httpMock) => {
    service = _service;
    httpMock = _httpMock;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll(): should return all routes', done => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    service.getRoutes(2, 2, 'name,asc').subscribe(value => {
      expect(value).toHaveProperty('routes');
      expect(value.routes.length).toBe(5);
      done();
    });
  });
});
