import { TestBed } from '@angular/core/testing';

import { RiderService } from './rider.service';
import {riders} from './mock.data';

describe('RiderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RiderService = TestBed.get(RiderService);
    expect(service).toBeTruthy();
  });

  it('should return an observable of riders', () => {
    const service: RiderService = TestBed.get(RiderService);
    let result;
    service.getRiders().subscribe(data => {
      result = data;
    });
    expect(result).toEqual(riders);
  });
});
