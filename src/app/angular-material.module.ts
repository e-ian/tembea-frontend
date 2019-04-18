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
  MatSelectModule,
  MatButtonModule,
  MatTabsModule,
  MatBadgeModule,
  MatGridListModule,
  MatOptionModule,
  MatAutocompleteModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    MatSelectModule,
    MatTabsModule,
    MatBadgeModule,
    MatOptionModule,
    MatGridListModule,
    MatAutocompleteModule,
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
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatTabsModule,
    MatBadgeModule,
    MatGridListModule,
    MatAutocompleteModule,
  ]
})
export class AngularMaterialModule {}
