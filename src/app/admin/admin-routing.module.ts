import { DepartmentsComponent } from './settings/departments/departments.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabsComponent } from './cabs/cabs.component';
import { CabInventoryComponent } from './cabs/cab-inventory/cab-inventory.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';
import { RouteRequestsComponent } from './routes/route-requests/route-requests.component';
import { PagingParamsResolver } from '../shared/paging-params.resolver';
import { PendingRequestComponent } from './trips/pending-request/pending-request.component';
import {TripHistoryComponent} from './trips/trip-history/trip-history.component';
import {TripNavComponent} from './trips/trip-nav/trip-nav.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [],
        data: { title: 'Welcome' }
      },
      {
        path: 'routes/create',
        component: CreateRouteComponent,
        canActivate: [],
        data: { title: 'Create Route' }
      },
      {
        path: 'routes/requests',
        component: RouteRequestsComponent,
        canActivate: [],
        data: { title: 'Routes Requests' }
      },
      {
        path: 'routes/inventory',
        component: RoutesInventoryComponent,
        canActivate: [],
        data: { title: 'Routes Inventory' }
      },
      {
        path: 'trips/pending',
        component: PendingRequestComponent,
        resolve: {
          pagingParams: PagingParamsResolver
        },
        canActivate: [],
        data: { title: 'Pending Trips' }
      },

      {
        path: 'trips/history',
        component: TripHistoryComponent,
        canActivate: [],
        data: { title: 'Trip History' }
      },
      {
        path: 'trips/itinerary',
        component: TripNavComponent,
        canActivate: [],
        data: { title: 'All Trips' }
      },
      {
        path: 'cabs/pending',
        component: CabsComponent,
        canActivate: [],
        data: { title: 'Pending Cab Requests' }
      },
      {
        path: 'cabs/itinerary',
        component: CabsComponent,
        canActivate: [],
        data: { title: 'All Cabs' }
      },
      {
        path: 'cabs/inventory',
        component: CabInventoryComponent,
        canActivate: [],
        data: { title: 'Cabs Inventory' }
      },
      {
        path: 'settings/fellows',
        component: SettingsComponent,
        canActivate: [],
        data: { title: 'Fellows' }
      },
      {
        path: 'settings/departments',
        component: DepartmentsComponent,
        canActivate: [],
        data: { title: 'Departments' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
