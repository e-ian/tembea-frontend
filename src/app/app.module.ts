import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TOASTR_TOKEN, Toastr } from './shared/toastr.service';
import { CookieService } from './auth/ngx-cookie-service.service';
import { UnauthorizedLoginComponent } from './auth/unauthorized-login/unauthorized-login.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { AuthService } from './auth/__services__/auth.service';
import { AngularMaterialModule } from './angular-material.module';

const toastr: Toastr = window['toastr'];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedLoginComponent,
    LoginRedirectComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [
    AuthService,
    CookieService,
    { provide: TOASTR_TOKEN, useValue: toastr }
  ],
  entryComponents: [
    UnauthorizedLoginComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
