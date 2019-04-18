import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { ReturnExistingCabsComponent } from './return-existing-cabs.component';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { AngularMaterialModule } from '../../../../angular-material.module';
import { MediaObserver } from '@angular/flex-layout';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReturnExistingCabsComponent', () => {
  let component: ReturnExistingCabsComponent;
  let injector: Injector;
  let cabservice: any;
  let fixture: ComponentFixture<ReturnExistingCabsComponent>;

  beforeEach(async(() => {
    const mediaObserverMock = {
      media$: of({ mqAlias: 'xs', mediaQuery: '' })
    };

    TestBed.configureTestingModule({
      imports: [AngularMaterialModule, HttpClientTestingModule],
      declarations: [ReturnExistingCabsComponent],
      providers: [
        { provide: MediaObserver, useValue: mediaObserverMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnExistingCabsComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    cabservice = injector.get(CabsInventoryService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('Initial load', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
  describe('getCabsInventory', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return an array of cab objects', () => {
      const result = jest.spyOn(cabservice, 'getCabs').mockReturnValue(of({
        model: 'Subaru', driverPhoneNo: '078564321', driverName: 'Soko', capacity: 4
      }));
      const data = jest.spyOn(component, 'startFiltering').mockReturnValue();

      component.getCabsInventory();
      expect(result).toHaveBeenCalledTimes(1);
      expect(data).toHaveBeenCalledTimes(1);
    });
  });
  describe('click', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should emit the clicked cab option', () => {
      const value = { cabDetails: ''};
      component.clickedCabs.emit = jest.fn();

      component.click(value);

      expect(component.clickedCabs.emit).toBeCalled();
    });
  });
  describe('_filter', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it('should return an array when the search term matches the available models', () => {
      component.cabs = [
        {
          model: 'Subaru', driverPhoneNo: '078564321', driverName: 'Soko',
          capacity: 4, regNumber: 'UBE234X', location: 'Kampala'
        },
        {
          model: 'Prado', driverPhoneNo: '078564321', driverName: 'Soko',
          capacity: 4, regNumber: 'UBE234X', location: 'Kampala'
      }]

      const result = component._filter('Su');

      expect(result).toEqual([{
        model: 'Subaru', driverPhoneNo: '078564321', driverName: 'Soko',
        capacity: 4, regNumber: 'UBE234X', location: 'Kampala'
      }]);
    });
    it('should return an empty array when the search term does not match any model', () => {
      component.cabs = [
        {
          model: 'Subaru', driverPhoneNo: '078564321', driverName: 'Soko',
          capacity: 4, regNumber: 'UBE234X', location: 'Kampala'
        },
        {
          model: 'Prado', driverPhoneNo: '078564321', driverName: 'Soko',
          capacity: 4, regNumber: 'UBE234X', location: 'Kampala'
      }]
      const result = component._filter('Xe');
      expect(result).toEqual([]);
    });
  });
  describe('MediaObserver with xs', () => {
    it('should change cols, colspan and rowHeight when the screen is xs', () => {
      expect(component.cols).toEqual(2);
      expect(component.colspan).toEqual(2);
      expect(component.rowHeight).toEqual('5:1')
    });
  });
  describe('keyWordFilter', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it('should filter when cabDetails is given/exists', () => {
      component.approveForm = { controls: 'control', valueChanges: 'aaa' };
      jest.spyOn(component, '_filter').mockReturnValue([]);
      const value = { cabDetails: 'Sub'}


      component.keyWordFilter(value);

      expect(component._filter).toBeCalledTimes(1);
    });
    it('should filter when cabRegNumber is given/exists', () => {
      jest.spyOn(component, '_filter').mockReturnValue([])
      const value = { cabRegNumber: 'Sub'}

      component.keyWordFilter(value);

      expect(component._filter).toBeCalledTimes(1);
    });
    it('should patch form inputs when cabDetails is empty', () => {
      const value = { cabDetails: ''};

      component.keyWordFilter(value);

      expect(component.disableOtherInput).toBe(false);
    });
  });
});
