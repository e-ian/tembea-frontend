import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlaceHolderComponent} from './components/place-holder/place-holder.component';
import {AdminComponent} from './components/admin/admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children: [
      { path: 'dashboard', component: PlaceHolderComponent, canActivate: [] },
      { path: 'routes/create', component: PlaceHolderComponent, canActivate: [] },
      { path: 'routes/inventory', component: PlaceHolderComponent, canActivate: [] },
      { path: 'trips/pending', component: PlaceHolderComponent, canActivate: [] },
      { path: 'trips/history', component: PlaceHolderComponent, canActivate: [] },
      { path: 'trips/itinerary', component: PlaceHolderComponent, canActivate: [] },
      { path: 'cabs/pending', component: PlaceHolderComponent, canActivate: [] },
      { path: 'cabs/itinerary', component: PlaceHolderComponent, canActivate: [] },
      { path: 'settings/fellows', component: PlaceHolderComponent, canActivate: [] },
      { path: 'settings/departments', component: PlaceHolderComponent, canActivate: [] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
