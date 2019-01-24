import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import {AngularMaterialModule} from '../angular-material.module';
import {PlaceHolderComponent} from './components/place-holder/place-holder.component';
import {AdminComponent} from './components/admin/admin.component';

@NgModule({
  declarations: [AdminComponent, PlaceHolderComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule
  ],
})
export class AdminModule { }
