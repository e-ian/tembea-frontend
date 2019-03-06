import { EmptyPageComponent } from './../../empty-page/empty-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

import { DepartmentsComponent } from './departments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { environment } from '../../../../environments/environment';
import getDepartmentsMock from './__mocks__/getDepartments.response.mock';
import { DepartmentsService } from '../../__services__/departments.service';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { AlertService } from 'src/app/shared/alert.service';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('DepartmentsComponent', () => {
  let departmentComponent: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;
  const service = {
    getDepartments: jest.fn().mockReturnValue(of(true)),
    http: {
      get: jest.fn(),
    },
    departmentsUrl: `${environment.tembeaBackEndUrl}/api/v1/departments`
  };
  const alertMockData = {
    error: jest.fn(),
    success: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsComponent, EmptyPageComponent, AppPaginationComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        { provide: DepartmentsService, useValue: service },
        { provide: AlertService, useValue: alertMockData }
      ]
    });
    fixture = TestBed.createComponent(DepartmentsComponent);
    departmentComponent = fixture.componentInstance;
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Exist - DepartmentsComponent', async(() => {
    expect(departmentComponent).toBeTruthy();
  }));

  it('should set departments correctly from the service', async(() => {
    service.getDepartments.mockReturnValue(of(getDepartmentsMock));
    fixture.detectChanges();
    expect(fixture.componentInstance.departments.length).toBe(4);
  }))

  it('should render actions button', async(() => {
    departmentComponent.getDepartments();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));
    expect(button.length).toEqual(1);
  }));

  it('should create one active button for each department', async(() => {
    service.getDepartments.mockReturnValue(of(getDepartmentsMock));
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.active-status-button')).length).toBe(4);
  }));
  it('should update and load page', (() => {
    jest.spyOn(departmentComponent, 'getDepartments');
    expect(departmentComponent.pageNo).toEqual(1);
    departmentComponent.setPage(2);
    fixture.detectChanges();
    expect(departmentComponent.pageNo).toEqual(2);
    expect(departmentComponent.getDepartments).toHaveBeenCalled();
    expect(fixture.componentInstance.isLoading).toBe(false);
  }));
});
