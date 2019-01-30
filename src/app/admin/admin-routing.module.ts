import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabsComponent } from './cabs/cabs.component'
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { TripsComponent } from './trips/trips.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [] },
      { path: 'routes/create', component: CreateRouteComponent, canActivate: [] },
      { path: 'routes/inventory', component: RoutesInventoryComponent, canActivate: [] },
      { path: 'trips/pending', component: TripsComponent, canActivate: [] },
      { path: 'trips/history', component: TripsComponent, canActivate: [] },
      { path: 'trips/itinerary', component: TripsComponent, canActivate: [] },
      { path: 'cabs/pending', component: CabsComponent, canActivate: [] },
      { path: 'cabs/itinerary', component: CabsComponent, canActivate: [] },
      { path: 'settings/fellows', component: SettingsComponent, canActivate: [] },
      { path: 'settings/departments', component: SettingsComponent, canActivate: [] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
