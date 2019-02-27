import { inject, TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DepartmentsService } from '../departments.service';
import { environment } from 'src/environments/environment';

describe('Department Service', () => {
  const { tembeaBackEndUrl } = environment;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientTestingModule ],
      providers: [
        DepartmentsService,
      ],
    })
  );

  it('getDepartments(): should return Departments model',
    async(inject([DepartmentsService, HttpTestingController], (departmentsService, _httpMock) => {
    const response = { departments: [], success: true }
    const httpMock = _httpMock;
    const size = 5;
    const page = 1;
    departmentsService.getDepartments(size, page).subscribe((data) => {
      expect(data).toEqual(response);
    });
    const request = httpMock.expectOne(`${tembeaBackEndUrl}/api/v1/departments?size=${size}&page=${page}`);
    expect(request.request.method).toEqual('GET');
    request.flush(response);
    httpMock.verify();
  })));
});
