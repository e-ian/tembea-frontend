import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    ConvertTimePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMaterialModule
  ],
})
export class AdminModule { }
