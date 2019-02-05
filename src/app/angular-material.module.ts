import { NgModule } from '@angular/core';
import {
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatDialogModule,
  MatCardModule,
  MatButtonModule,
  MatTabsModule,
  MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogoutModalComponent } from './auth/logout-modal/logout-modal.component';

@NgModule({
  imports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule
  ],
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule
  ],
  declarations: [
    LogoutModalComponent
  ]
})
export class AngularMaterialModule { }
