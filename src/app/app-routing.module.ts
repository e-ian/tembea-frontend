import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { LoginRedirectComponent } from './login/login-redirect/login-redirect.component';
import { HomeRouteActivatorGuard } from './home/home-route-activator.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [HomeRouteActivatorGuard] },
  { path: 'login/:redirect', component: LoginRedirectComponent },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
