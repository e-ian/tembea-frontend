import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabsComponent } from './cabs/cabs.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { SettingsComponent } from './settings/settings.component';
import { TripsComponent } from './trips/trips.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouteRequestsComponent } from './routes/route-requests/route-requests.component';
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { CustomTitlecasePipe } from './__pipes__/custom-titlecase.pipe';
import { ConvertTimePipe } from './__pipes__/convert-time.pipe';
import { AlertService } from '../shared/alert.service';
import { GoogleMapsService } from '../shared/googlemaps.service';
import { RouteService } from './routes/route.service';
import { CreateRouteHelper } from './routes/create-route/create-route.helper';
import { AppPaginationComponent } from './layouts/app-pagination/app-pagination.component';

import { environment } from '../../environments/environment';
import { DepartmentsComponent } from './settings/departments/departments.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CabsComponent,
    CreateRouteComponent,
    RoutesInventoryComponent,
    SettingsComponent,
    TripsComponent,
    HeaderComponent,
    RouteRequestsComponent,
    EmptyPageComponent,
    CustomTitlecasePipe,
    ConvertTimePipe,
    AppPaginationComponent,
    DepartmentsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    FormsModule,
    AngularMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googMapsAPIKey,
      libraries: ['places']
    }),
    AgmDirectionModule
  ],
  providers: [AlertService, GoogleMapsService, RouteService, CreateRouteHelper]
})
export class AdminModule { }
