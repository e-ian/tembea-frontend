/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TripRequestService } from './trip-request.service';
import { tripRequestMock } from './__mocks__/trip-request.mock';
import {DepartmentsModel} from 'src/app/shared/models/departments.model';
import {department} from 'src/app/shared/__mocks__/department.mock';

describe('Service Tests', () => {
  describe('Trip Request Service', () => {
    let injector: TestBed;
    let service: TripRequestService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      injector = getTestBed();
      service = injector.get(TripRequestService);
      httpMock = injector.get(HttpTestingController);
    });

    describe('Service methods', async () => {

      it('should return a list of pending trips', (done) => {
        const requestedOn = tripRequestMock.requestedOn.toISOString();
        const departureTime = tripRequestMock.departureTime.toISOString();
        const returnedFromService = {
          pageMeta: { totalResults: 123 },
          trips: [{ ...tripRequestMock, requestedOn, departureTime }]
        };
        service
          .query({ status: 'Approved' })
          .subscribe(result => {
            expect(result.trips).toContainEqual(tripRequestMock);
            done();
          });

        const url = `${environment.tembeaBackEndUrl}/api/v1/trips`;
        const req = httpMock.expectOne({ method: 'GET' });
        expect(req.request.url).toBe(url);

        req.flush({ data: returnedFromService });
      });
    });

   it('should get all department', (done) => {
       const departmentMock: DepartmentsModel = {department};

     service.getDepartments()
         .subscribe(result => {
           expect(result).toBe(departmentMock.departments);
           done();
         });

       const departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;

       const req = httpMock.expectOne(departmentsUrl);

       expect(req.request.method).toEqual('GET');

       req.flush(departmentMock);

     httpMock.verify();
   });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
