import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { ProviderService } from './providers.service';

describe('ProvidersService', () => {
  let service: ProviderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProviderService]
    });
    service = TestBed.get(ProviderService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProviders', () => {
    beforeEach(() => {
      jest.spyOn(HttpClient.prototype, 'get');
    })
    it('should call HttpClient.getProviders', () => {
      service.getProviders(1, 1);
      expect(HttpClient.prototype.get).toBeCalled();
    });
    it('return all the providers', () => {
      jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
      const result = service.getProviders(1, 1);
      result.subscribe(data => {
        expect(data).toEqual({});
      })
    })
  })
  describe('Update Provider', () => {
    it('should call http client patch on update provider', () => {
      jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of({}));
      service.editProvider({}, 1);
      expect(HttpClient.prototype.patch).toHaveBeenCalled();
   });
    it('should return data on http edit provider', () => {
      const response = { success: true };
      jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of(response));
      const results = service.editProvider({}, 1);
      results.subscribe(data => {
        expect(data).toEqual(response);
      });
    })
  })});
