import { DepartmentsService } from '../departments.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getDepartmentsMock } from '../../routes/routes-inventory/__mocks__/get-departments.mock';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';

describe('DepartmentsService', () => {
  let injector: TestBed;
  let service: DepartmentsService;
  let httpMock: HttpTestingController;
  const getDepartmentsResponse = new DepartmentsModel()
    .deserialize(getDepartmentsMock)

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(DepartmentsService);
    httpMock = injector.get(HttpClientTestingModule);
  });

  describe('getDepartments', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make http request to get departments', () => {
      let departments;
      jest.spyOn(service, 'getDepartments').mockReturnValue(of(getDepartmentsResponse));

      service.getDepartments(2, 2).subscribe(value => {
        departments = value
      });

      expect(departments.departments).toEqual(getDepartmentsMock.departments);
    })
  })
});
