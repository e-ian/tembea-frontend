import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const response = { id: '121', name: 'james' }
  const { tembeaBackEndUrl } = environment

  beforeEach(() => {
   TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.get(AuthService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should GET login info', () => {
    authService.login()
      .subscribe(data => {
        expect(data).toEqual(response);
      });

    const loginRequest: TestRequest = httpTestingController.expectOne(`${tembeaBackEndUrl}/api/v1/auth/login/verify`);

    expect(loginRequest.request.method).toEqual('GET');

    loginRequest.flush(response);
  });
});
