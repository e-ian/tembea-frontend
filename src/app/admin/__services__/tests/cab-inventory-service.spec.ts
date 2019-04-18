import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CabsInventoryService } from '../cabs-inventory.service';
import getCabsResponseMock from '../__mocks__/cabs-mock';



describe('CabsInventoryService', () => {
  let service: CabsInventoryService;
  let httpMock: HttpTestingController;
  const deleteSuccessResponseMock = {
    success: true,
    message: 'Cab successfully deleted'
  };

  const deleteFailResponseMock = {
    success: false,
    message: 'Cab does not exist'
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CabsInventoryService],
    })
  );

  beforeEach(inject([CabsInventoryService, HttpTestingController], (_service, _httpMock) => {
    service = _service;
    httpMock = _httpMock;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return http success response to delete a cab', () => {
    const spy = jest.spyOn(HttpClient.prototype, 'delete');
    spy.mockReturnValue(of(deleteSuccessResponseMock));
    const result = service.deleteCab(1);
    result.subscribe(data => {
      expect(data).toEqual(deleteSuccessResponseMock);
    });
    expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteSuccessResponseMock)));
  });

  it('should return http fail response to delete a non-existing cab', () => {
    const spy = jest.spyOn(HttpClient.prototype, 'delete');
    spy.mockReturnValue(of(deleteFailResponseMock));
    const result = service.deleteCab(1);
    result.subscribe(data => {
      expect(data).toEqual(deleteFailResponseMock);
    });
    expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteFailResponseMock)));
  });

  it('getCabs(): should get all cabs', done => {
    jest.spyOn(service, 'getCabs').mockReturnValue(of(getCabsResponseMock));
    const result = service.getCabs(2, 2, 'name,asc,batch,asc');
    result.subscribe(value => {
      expect(value).toHaveProperty('cabs');
      expect(value).toEqual(getCabsResponseMock);
      expect(value.cabs.length).toBe(2);
      done();
    });
  });
});
