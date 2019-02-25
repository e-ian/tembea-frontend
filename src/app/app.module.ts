import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoutModalComponent } from './auth/logout-modal/logout-modal.component';
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

const toastr: Toastr = window['toastr'];

@NgModule({
  declarations: [
    ActiveTimeDirective,
    AppComponent,
    HomeComponent,
    UnauthorizedLoginComponent,
    LoginRedirectComponent,
    LogoutModalComponent,
    RouteApproveDeclineModalComponent,
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
    CookieService,
    ClockService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true }
  ],
  entryComponents: [
    UnauthorizedLoginComponent,
    LogoutModalComponent,
    RouteApproveDeclineModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
