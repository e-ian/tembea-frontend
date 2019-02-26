import { SpyObject } from '../../../__mocks__/SpyObject';
import { CookieService } from '../ngx-cookie-service.service';
import { ClockService } from '../clock.service';
import { AuthService } from '../auth.service';

export class MockCookieService extends SpyObject {
  constructor() {
    super(CookieService);
  }
}
export class MockClockService extends SpyObject {
  constructor() {
    super(ClockService);
  }
}
export class MockAuthService extends SpyObject {
  constructor() {
    super(AuthService);
  }
}
