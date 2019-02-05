import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import getRoutesResponseMock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';

describe('RoutesInventoryComponent', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  let httpMock: HttpTestingController;
  let service: RoutesInventoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoutesInventoryComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule],
    }).compileComponents();
    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(inject([RoutesInventoryService, HttpTestingController], (_service, _httpMock) => {
    service = _service;
    httpMock = _httpMock;
  }));

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and render routes', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));
    expect(button.length).toEqual(1);
  }));

  it('should call getRoutes and return list of routes', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();

    expect(service.getRoutes).toHaveBeenCalled();
    expect(component.routes).toEqual(getRoutesResponseMock.routes);

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(1);
  }));

  it('should change page upon clicking page number', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    jest.spyOn(component, 'setPage');

    const button = fixture.debugElement.queryAll(By.css('.page-number'));
    button[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.setPage).toHaveBeenCalled();
  }));

  it('should navigate to the next group of pages', async(() => {
    jest.spyOn(service, 'getRoutes').mockReturnValue(of(getRoutesResponseMock));
    component.getRoutesInventory();
    fixture.detectChanges();
    jest.spyOn(component, 'nextGroup');

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(1);
    expect(fixture.componentInstance.currentPageGroup).toEqual(0);

    button[0].triggerEventHandler('click', null);
    expect(component.nextGroup).toHaveBeenCalled();
    fixture.detectChanges();
  }));

  it('should change the current page group', async(() => {
    component.nextGroup();
    fixture.detectChanges();
    expect(component.currentPageGroup).toEqual(1);
  }));

  it('should change the current page group to previous', async(() => {
    const currentGroup = component.currentPageGroup;
    component.prevGroup();
    fixture.detectChanges();
    expect(component.currentPageGroup).toEqual(currentGroup - 1);
  }));

  it('should set page', async(() => {
    jest.spyOn(service, 'getRoutes');
    jest.spyOn(component, 'getRoutesInventory');

    expect(component.pageNo).toEqual(1);

    component.setPage(20);
    fixture.detectChanges();
    expect(component.pageNo).toEqual(20);
    expect(component.getRoutesInventory).toHaveBeenCalled();
  }));
});
