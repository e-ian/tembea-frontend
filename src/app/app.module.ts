import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './admin/confirmation-dialog/confirmation-dialog.component';
import { ClockService } from './auth/__services__/clock.service';
import { ActiveTimeDirective } from './active-time.directive';
import { HomeComponent } from './home/home.component';
import { Toastr, TOASTR_TOKEN } from './shared/toastr.service';
import { CookieService } from './auth/__services__/ngx-cookie-service.service';
import { UnauthorizedLoginComponent } from './auth/unauthorized-login/unauthorized-login.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { AuthService } from './auth/__services__/auth.service';
import { AngularMaterialModule } from './angular-material.module';
import { JwtHttpInterceptor } from './shared/jwt-http.interceptor';
import { RouteApproveDeclineModalComponent } from './admin/routes/route-approve-decline-modal/route-approve-decline-modal.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from './shared/alert.service';
import { RoutesInventoryEditModalComponent
} from './admin/routes/routes-inventory/routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { errorHandlerFactory } from './shared/bugsnag.service';
import { AddDepartmentsModalComponent } from './admin/settings/departments/add-departments-modal/add-departments-modal.component';
import { TripApproveDeclineModalComponent } from './admin/trips/trip-approve-decline-modal/trip-approve-decline-modal.component';

const toastr: Toastr = window['toastr'];

@NgModule({
  declarations: [
    ActiveTimeDirective,
    AppComponent,
    HomeComponent,
    UnauthorizedLoginComponent,
    LoginRedirectComponent,
    RouteApproveDeclineModalComponent,
    ConfirmModalComponent,
    RoutesInventoryEditModalComponent,
    AddDepartmentsModalComponent,
    TripApproveDeclineModalComponent
  ],
  imports: [
  FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    AuthService,
    AlertService,
    CookieService,
    ClockService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: AlertService, useValue: toastr },
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
    { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  entryComponents: [
    UnauthorizedLoginComponent,
    ConfirmModalComponent,
    RouteApproveDeclineModalComponent,
    RoutesInventoryEditModalComponent,
    AddDepartmentsModalComponent,
    TripApproveDeclineModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
