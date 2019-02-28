import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth/__services__/auth.service';
import { MockAuthService, MockClockService, MockCookieService } from '../auth/__services__/__mocks__';
import { ClockService } from '../auth/__services__/clock.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { TOASTR_TOKEN } from '../shared/toastr.service';
import { mockToastr } from '../shared/__mocks__/mockData';
import { SpyObject } from '../__mocks__/SpyObject';
import { MatDialogRef } from '@angular/material';


export class MockMatDialogRef extends SpyObject {
  constructor() {
    super(MatDialogRef);
  }
}

@NgModule({
  providers: [
    {
      provide: AuthService,
      useClass: MockAuthService
    },
    {
      provide: ClockService,
      useClass: MockClockService
    },
    {
      provide: MatDialogRef,
      useClass: MockMatDialogRef
    },
    {
      provide: MockCookieService,
      useClass: CookieService
    },
    {
      provide: TOASTR_TOKEN,
      useValue: mockToastr
    }
  ],
  imports: [HttpClientTestingModule]
})
export class AppTestModule {
}
