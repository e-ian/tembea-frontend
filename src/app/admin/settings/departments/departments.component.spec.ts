import { EmptyPageComponent } from './../../empty-page/empty-page.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

import { DepartmentsComponent } from './departments.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { environment } from '../../../../environments/environment';
import getDepartmentsMock from './__mocks__/getDepartments.response.mock';
import { DepartmentsService } from '../../__services__/departments.service';

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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
      providers: [
        {
          provide: DepartmentsService,
          useValue: service
        }
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
    expect(fixture.componentInstance.departments.length).toBe(20);
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
    expect(fixture.debugElement.queryAll(By.css('.active-status-button')).length).toBe(20);
  }));

  it('should change page upon clicking page number', async(() => {
    jest.spyOn(service, 'getDepartments').mockReturnValue(of(getDepartmentsMock));
    departmentComponent.getDepartments();
    fixture.detectChanges();
    jest.spyOn(departmentComponent, 'setPage');

    const button = fixture.debugElement.queryAll(By.css('.page-number'));
    button[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(departmentComponent.setPage).toHaveBeenCalled();
  }));

  it('should navigate to the prev group of pages', async(() => {
    jest.spyOn(service, 'getDepartments').mockReturnValue(of(getDepartmentsMock));
    departmentComponent.currentPageGroup = 1;
    departmentComponent.getDepartments();
    fixture.detectChanges();
    jest.spyOn(departmentComponent, 'prevGroup');

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(2);
    expect(fixture.componentInstance.currentPageGroup).toEqual(1);

    button[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(departmentComponent.prevGroup).toHaveBeenCalled();
  }));

  it('should navigate to the next group of pages', async(() => {
    jest.spyOn(service, 'getDepartments').mockReturnValue(of(getDepartmentsMock));
    departmentComponent.currentPageGroup = 1;
    departmentComponent.getDepartments();
    fixture.detectChanges();
    jest.spyOn(departmentComponent, 'nextGroup');

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(2);
    expect(fixture.componentInstance.currentPageGroup).toEqual(1);

    button[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(departmentComponent.nextGroup).toHaveBeenCalled();
  }));

  it('should run getRemainingItemsInDB() if numberOfPages is less than pageNo', async(() => {
    jest.spyOn(service, 'getDepartments').mockReturnValue(of(getDepartmentsMock));
    departmentComponent.pageNo = 4;
    jest.spyOn(departmentComponent, 'getRemainingItemsInDB');

    departmentComponent.getDepartments();
    fixture.detectChanges();
    expect(departmentComponent.getRemainingItemsInDB).toHaveBeenCalled();
  }));
});
