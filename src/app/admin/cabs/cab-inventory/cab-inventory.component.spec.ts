import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import getCabsResponseMock from './__mocks__/get-routes-response.mock';
import { of} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CabInventoryComponent } from './cab-inventory.component';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {AppEventService} from '../../../shared/app-events.service';


const appEventService = new AppEventService();
describe('CabInventoryComponent', () => {
  let component: CabInventoryComponent;
  let fixture: ComponentFixture<CabInventoryComponent>;

  const cabsInventoryMock = {
    getCabs: () => of(getCabsResponseMock),
  };

  const activatedRouteMock = {
      params: {subscribe: jest.fn() }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CabInventoryComponent
      ],
      providers: [
        {provide: CabsInventoryService, useValue: cabsInventoryMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AppEventService, useValue: appEventService}
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CabInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(cabsInventoryMock, 'getCabs');

  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create component and render cabs', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should update and load page', (() => {

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.cabs).toEqual([]);
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getCabsInventory');
      expect(component.pageNo).toEqual(1);

      component.setPage(20);
      fixture.detectChanges();
      expect(component.pageNo).toEqual(20);
      expect(component.getCabsInventory).toHaveBeenCalled();
    }));
  });

  describe('updateCabs', () => {
    it('should get list of cabs', (() => {
      const providerInfo = { providerName: test, providerId: 1 };
      jest.spyOn(component, 'loadCabs').mockImplementation();

      component.updateCabs(providerInfo);
      fixture.detectChanges();
      expect(component.loadCabs).toHaveBeenCalled();
    }));
  });
  describe('tabChanged', () => {
    it('should change to Drivers tab on click', () => {
      const expected = {'content': {'actionButton': 'Add Driver',
          'headerTitle': 'undefined Drivers', 'providerId': undefined}, 'name': 'updateHeaderTitle'};
      const event = {
        tab: { textLabel: 'Drivers' }
      };
      jest.spyOn(appEventService, 'broadcast');
      component.tabChanged(event);
      expect(appEventService.broadcast).toHaveBeenCalledWith(expected);

    });
    it('should change to Vehicles tab on click', () => {
      const expected = {'content': {'actionButton': 'Add a New Vehicle',
          'badgeSize': undefined, 'headerTitle': 'undefined Vehicles',
          'providerId': undefined}, 'name': 'updateHeaderTitle'};
      const event = {
        tab: { textLabel: 'Vehicles' }
      };
      jest.spyOn(appEventService, 'broadcast');
      component.tabChanged(event);
      expect(appEventService.broadcast).toHaveBeenCalledWith(expected);

    });

  });
});
