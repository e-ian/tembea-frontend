import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginRedirectComponent } from './login/login-redirect/login-redirect.component';
import { AuthService } from './auth/auth.service';
import { TOASTR_TOKEN, Toastr } from './shared/toastr.service';
import { CookieService } from './auth/ngx-cookie-service.service';

const toastr: Toastr = window['toastr'];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginRedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    CookieService,
    { provide: TOASTR_TOKEN, useValue: toastr }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
