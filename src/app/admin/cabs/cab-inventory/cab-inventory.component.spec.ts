import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import getCabsResponseMock from './__mocks__/get-routes-response.mock';
import { of } from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CabInventoryComponent } from './cab-inventory.component';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('CabInventoryComponent', () => {
  let component: CabInventoryComponent;
  let fixture: ComponentFixture<CabInventoryComponent>;

  const cabsInventoryMock = {
    getCabs: () => of(getCabsResponseMock),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CabInventoryComponent
      ],
      providers: [
        {provide: CabsInventoryService, useValue: cabsInventoryMock}
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CabInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(cabsInventoryMock, 'getCabs');

  })

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create component and render cabs', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getCabsInventory');

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.cabs).toEqual(getCabsResponseMock.cabs);
      expect(component.getCabsInventory).toHaveBeenCalled();
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
    }))
  })
});
