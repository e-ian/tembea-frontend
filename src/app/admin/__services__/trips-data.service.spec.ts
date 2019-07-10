import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TripsDataService } from './trips-data.service';
import { HttpClient } from '@angular/common/http';


describe('TripRatingsService', () => {
  let injector: TestBed;
  let service: TripsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(TripsDataService);

  });

  it('should call the get the Trip Data', () => {
    jest.spyOn(HttpClient.prototype, 'post');
    service.getTripData({ startDate: { from: '2018-10-12' }, endDate: { to: '2018-12-24' } });
    expect(HttpClient.prototype.post).toHaveBeenCalled();
  });
});
