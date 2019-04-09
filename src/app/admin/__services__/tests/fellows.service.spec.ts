import { FellowsService } from '../fellows.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { FellowsModel } from 'src/app/shared/models/fellows.model';
import { fellowsMockResponse } from '../__mocks__/fellows.mock';
import { of } from 'rxjs';

describe('Fellows Service', () => {
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
});
