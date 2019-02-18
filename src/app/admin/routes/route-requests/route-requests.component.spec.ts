import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { RouteRequestsComponent } from './route-requests.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { MatDialog } from '@angular/material';
import {AngularMaterialModule} from '../../../angular-material.module';
import {RouteRequestService} from '../../__services__/route-request.service';
import getAllResponseMock from './__mocks__/get-all-response.mock';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {EmptyPageComponent} from '../../empty-page/empty-page.component';
import {CustomTitlecasePipe} from '../../__pipes__/custom-titlecase.pipe';
import {CookieService} from '../../../auth/__services__/ngx-cookie-service.service';
import {ClockService} from '../../../auth/__services__/clock.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Toastr, TOASTR_TOKEN} from '../../../shared/toastr.service';
import {AuthService} from '../../../auth/__services__/auth.service';
import { ConvertTimePipe } from 'src/app/admin/__pipes__/convert-time.pipe';
import {AisService} from '../../__services__/ais.service';

const toastr: Toastr = window['toastr'];

describe.skip('RouteRequestsComponent', () => {
  let component: RouteRequestsComponent;
  let fixture: ComponentFixture<RouteRequestsComponent>;
  let httpMock: HttpTestingController;
  let service: RouteRequestService;

  const authMock = {
    getCurrentUser: jest.fn(() => ({
      firstName: 'name',
      first_name: 'string',
      lastName: 'string',
      last_name: 'string',
      email: 'string',
      name: 'string',
      picture: 'string'}))
  };
  const mockMatDialog = {};

  const AisMock = {
    getResponse: () => ({ subscribe: () => ({ picture: ''})})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteRequestsComponent, EmptyPageComponent, CustomTitlecasePipe, ConvertTimePipe  ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        AngularMaterialModule,
        RouterTestingModule
      ],
      providers: [
        CookieService,
        ClockService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: AuthService, useValue: authMock },
        { provide: AisService, useValue: AisMock }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RouteRequestsComponent);
    component = fixture.componentInstance;
    component.user = {
      id: '2',
      firstName: 'name',
      first_name: 'string',
      lastName: 'string',
      last_name: 'string',
      email: 'string',
      name: 'string',
      picture: 'string',
      roles: []
    };
    fixture.detectChanges();
  }));

  beforeEach(inject([RouteRequestService, HttpTestingController], (_service, _httpMock) => {
    service = _service;
    httpMock = _httpMock;
  }));

  it('should create RouteRequestsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Render Route Boxes: should render 3 route boxes with the first one active', () => {
    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');
    request.flush(getAllResponseMock);

    fixture.detectChanges();
    const boxes = fixture.debugElement.queryAll(By.css('.route-box'));

    expect(boxes.length).toEqual(3);
    expect(Object.keys(boxes[0].properties)).toContain('className');
    expect(boxes[0].properties.className).toContain('active');

    expect(Object.keys(boxes[1].properties)).toContain('className');
    expect(boxes[1].properties.className).not.toContain('active')
  });

  it('onClickRouteBox(): should call onCLickRouterBox', () => {
    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');
    request.flush(getAllResponseMock);
    fixture.detectChanges();

    const boxes = fixture.debugElement.queryAll(By.css('.route-box'));
    expect(boxes.length).toEqual(3);
    const secondBox = boxes[1];

    jest.spyOn(component, 'onClickRouteBox');

    expect(component.onClickRouteBox).not.toHaveBeenCalled();

    secondBox.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.onClickRouteBox).toHaveBeenCalledWith(1, getAllResponseMock.routes[1]);

    expect(Object.keys(boxes[1].properties)).toContain('className');
    expect(boxes[1].properties.className).toContain('active')
  });
});
