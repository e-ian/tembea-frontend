import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabsComponent } from './cabs/cabs.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { SettingsComponent } from './settings/settings.component';
import { TripsComponent } from './trips/trips.component';
import { AdminComponent } from './admin/admin.component';
import {HeaderComponent} from './header/header.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CabsComponent,
    CreateRouteComponent,
    RoutesInventoryComponent,
    SettingsComponent,
    TripsComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule
  ],
})
export class AdminModule { }
