import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabsComponent } from './cabs/cabs.component';
import { CabInventoryComponent } from './cabs/cab-inventory/cab-inventory.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { SettingsComponent } from './settings/settings.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouteRequestsComponent } from './routes/route-requests/route-requests.component';
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { CustomTitlecasePipe } from './__pipes__/custom-titlecase.pipe';
import { ConvertTimePipe } from './__pipes__/convert-time.pipe';
import { AlertService } from '../shared/alert.service';
import { ShortenNamePipe } from './__pipes__/shorten-name.pipe';
import { GoogleMapsService } from '../shared/googlemaps.service';
import { CreateRouteHelper } from './routes/create-route/create-route.helper';
import { AppPaginationComponent } from './layouts/app-pagination/app-pagination.component';

import { environment } from '../../environments/environment';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { TripItineraryComponent } from './trips/trip-itinerary/trip-itinerary.component';
import { TripNavComponent } from './trips/trip-nav/trip-nav.component';
import { TripHistoryComponent } from './trips/trip-history/trip-history.component';
import { PendingRequestComponent } from './trips/pending-request/pending-request.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { CustomDropdownComponent } from './layouts/custom-dropdown/custom-dropdown.component';
import { ExportComponent } from './export-component/export.component';
import { EmbassyVisitsComponent } from './travel/embassy-visits/embassy-visits.component';
import { AirportTransfersComponent } from './travel/airport-transfers/airport-transfers.component';
import { FellowsComponent } from './settings/fellows/fellows.component';
import { FellowCardComponent } from './settings/fellows/fellow-card/fellow-card.component';
import { DeleteFellowModalComponent } from './settings/fellows/delete-fellow-dialog/delete-dialog.component';
import { FellowComponent } from './settings/fellows/fellow/fellow.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CabsComponent,
    CabInventoryComponent,
    CreateRouteComponent,
    RoutesInventoryComponent,
    SettingsComponent,
    PendingRequestComponent,
    HeaderComponent,
    RouteRequestsComponent,
    EmptyPageComponent,
    CustomTitlecasePipe,
    ConvertTimePipe,
    ShortenNamePipe,
    AppPaginationComponent,
    ConvertTimePipe,
    DepartmentsComponent,
    AppPaginationComponent,
    TripItineraryComponent,
    TripNavComponent,
    TripHistoryComponent,
    PendingRequestComponent,
    DatePickerComponent,
    CustomDropdownComponent,
    ExportComponent,
    EmbassyVisitsComponent,
    AirportTransfersComponent,
    FellowsComponent,
    FellowCardComponent,
    DeleteFellowModalComponent,
    FellowComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    FormsModule,
    AngularMaterialModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googMapsAPIKey,
      libraries: ['places']
    }),
    AgmDirectionModule
  ],
  entryComponents: [ DeleteFellowModalComponent ],
  providers: [AlertService, GoogleMapsService, CreateRouteHelper]
})
export class AdminModule {}
