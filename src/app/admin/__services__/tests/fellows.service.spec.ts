import { FellowsService } from '../fellows.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { FellowsModel } from 'src/app/shared/models/fellows.model';
import { fellowsMockResponse } from '../__mocks__/fellows.mock';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('FellowsService', () => {
  let service: FellowsService;
  let httpMock: HttpTestingController;
  const getFellowsMockResponse = new FellowsModel().deserialize(
    fellowsMockResponse
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const testBed = getTestBed();
    service = testBed.get(FellowsService);
    httpMock = testBed.get(HttpTestingController);
  });
  afterEach(jest.resetAllMocks);
  afterAll(jest.restoreAllMocks);

  it('should make http request to get fellows', () => {
    let res;
    jest
      .spyOn(service, 'getFellows')
      .mockReturnValue(of(getFellowsMockResponse));
    service.getFellows(9, 1).subscribe(data => {
      res = data;
    });

    expect(res.fellows).toEqual(getFellowsMockResponse.fellows);
  });

  describe('removeFellowFromRoute', () => {
    it('should make a delete http call to API', () => {
      const spy = jest.spyOn(HttpClient.prototype, 'delete');
      const url = `${environment.tembeaBackEndUrl}/api/v1/routes/fellows/10/`;

      service.removeFellowFromRoute(10);

      expect(spy.mock.calls[0][0]).toEqual(url);
    })
  })
});
