import { inject, TestBed, async } from '@angular/core/testing';
import { HttpModule, XHRBackend , Response, ResponseOptions } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockBackend } from '@angular/http/testing';

import { DepartmentsService } from '../departments.service';
import getDepartmentsMock from '../../settings/departments/__mocks__/getDepartments.response.mock';
import { environment } from 'src/environments/environment';

describe('Department Service', () => {
  const { tembeaBackEndUrl } = environment;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientTestingModule ],
      providers: [
        DepartmentsService,        
        {
          provide: XHRBackend,
          useClass: MockBackend
        }
      ],
    })
  );
  it('should return an Observable<Array<Departments>', 
    async(inject([DepartmentsService, XHRBackend], (departmentsService, mockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: getDepartmentsMock
      })));
    });
    departmentsService.getDepartments(5, 2).subscribe((departments) => {
      expect(departments.length).toBe(20);
      expect(departments[0]['head.name']).toBe('Opeoluwa Iyi-Kuyoro');
    })
})));

it('getDepartments(): should return Departments model', 
  async(inject([DepartmentsService, HttpTestingController], (departmentsService, _httpMock) => {
  const response = { departments: [], success: true }
  const httpMock = _httpMock;
  const size = 5;
  const page = 1;
  departmentsService.getDepartments(size, page).subscribe((data)=>{
    expect(data).toEqual(response);
  });
  const request = httpMock.expectOne(`${tembeaBackEndUrl}/api/v1/departments?size=${size}&page=${page}`);
  expect(request.request.method).toEqual('GET');
  request.flush(response);
  httpMock.verify();
})));

});
