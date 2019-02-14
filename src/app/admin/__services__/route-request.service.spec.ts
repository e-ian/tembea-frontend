import {inject, TestBed} from '@angular/core/testing';

import { RouteRequestService } from './route-request.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import getAllResponseMock from '../routes/route-requests/__mocks__/get-all-response.mock';
import { MatDialogRef } from '@angular/material';
import { RouteApproveDeclineModalComponent } from '../routes/route-approve-decline-modal/route-approve-decline-modal.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { TOASTR_TOKEN } from 'src/app/shared/toastr.service';

describe('RoutesService', () => {
  let service: RouteRequestService;
  let httpMock: HttpTestingController;
  let routes = [];
  const mockAuthService = {};
  const mockToastr = {
    success: () => {}
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      RouteRequestService,
      { provide: AuthService, useValue: mockAuthService },
      { provide: TOASTR_TOKEN, useValue: mockToastr }
    ]
  }));

  beforeEach(inject([RouteRequestService, HttpTestingController], (_service, _httpMock) => {
    service = _service;
    httpMock = _httpMock;
    service.routesRequests.subscribe(value => {
      routes = value;
    });
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllRequests(): should return all pending routes', (done) => {
    expect(routes.length).toBe(0);
    service.getAllRequests();

    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');

    request.flush(getAllResponseMock);

    expect(routes.length).toBe(3);
    done();
  });

  describe('declineRequest', () => {
    it('should call handleDeclineResponse', (done) => {
      jest.spyOn(service, 'handleDeclineResponse').mockImplementation();
      service.declineRequest(1, 'some comment', 'test@email.com');

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');

      request.flush({
        success: true,
        message: 'This route request has been updated',
        data: {
          id: 1
        }
      });

      expect(service.handleDeclineResponse).toHaveBeenCalledTimes(1);
      jest.restoreAllMocks();
      done();
    });
  });

  describe('handleDeclineResponse', () => {
    it('should delete the route request', (done) => {
      const data = {
        success: true,
        message: 'This route request has been updated',
        data: {
          id: 1
        }
      };
      RouteRequestService.approvalDeclineDialog = <MatDialogRef<RouteApproveDeclineModalComponent>>{
        close: () => {}
      };

      service.handleDeclineResponse(data);
      service.routesRequests.subscribe(routeRequest => {
        expect(routeRequest).toEqual([]);
        done();
      });
    });
  });

  describe('approveRequest', () => {
    it('should call handleApproveResponse', (done) => {
      jest.spyOn(service, 'handleApproveResponse').mockImplementation();
      const routeDetails = {};
      routeDetails['routeName'] = 'Some route name';
      routeDetails['takeoff'] = '2:30';
      routeDetails['cabRegNumber'] = 'KXXX XX0';
      routeDetails['capacity'] = '1';

      service.approveRequest(1, 'some comment', routeDetails, 'some@email.com' );

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');

      request.flush({
        success: true,
        message: 'This route request has been updated',
        data: {
          id: 1
        }
      });

      expect(service.handleApproveResponse).toHaveBeenCalledTimes(1);
      jest.restoreAllMocks();
      done();
    });
  });

  describe('handleApproveResponse', () => {
    it('should create the route request', (done) => {
      const data = {
        success: true,
        message: 'This route request has been updated',
        data: {
          id: 1
        }
      };
      RouteRequestService.approvalDeclineDialog = <MatDialogRef<RouteApproveDeclineModalComponent>>{
        close: () => {}
      };

      service.handleApproveResponse(data);
      service.routesRequests.subscribe(routeRequest => {
        expect(routeRequest).toEqual([]);
        done();
      });
    });
  });

});
