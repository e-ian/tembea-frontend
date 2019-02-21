import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { RouteService } from '../route.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import getRoutesResponseMock from '../../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

describe('RouteService', () => {
  let service: RouteService;
  let httpMock: HttpTestingController;
  const { tembeaBackEndUrl } = environment;
  const deleteResponseMock = {
    success: true,
    message: 'route batch deleted successfully'
  }

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RouteService],
    })
  );

  beforeEach(inject([RouteService, HttpTestingController], (_service, _httpMock) => {
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

  it('should make http request to change the route status', () => {
    const response = { success: true }
    service.changeRouteStatus(1, { status: 'Active' }).subscribe(
      data => {
        expect(data).toEqual(response)
      });

      const changeStatusRequest: TestRequest = httpMock.expectOne(
        `${tembeaBackEndUrl}/api/v1/routes/1`
      )

      expect(changeStatusRequest.request.method).toEqual('PUT');
      changeStatusRequest.flush(response);
  });
  it('should make http request to delete route batch by Id', () => {
    const spy = jest.spyOn(HttpClient.prototype, 'delete');
    spy.mockReturnValue(of(deleteResponseMock));
    const result = service.deleteRouteBatch(1)
    result.subscribe(data => {
        expect(data).toEqual(deleteResponseMock);
    });
    expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteResponseMock)));
  })
});
