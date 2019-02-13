import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { Location } from '../../../shared/location.model';
import { RouteService } from '../route.service';
import { CreateRouteHelper } from './create-route.helper';

@Component({
  selector: 'app-create',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements AfterViewInit {
  lat: number = -1.219539;
  lng: number = 36.886215;
  zoom: number = 8;
  destinationIsDojo = true;
  origin = { lat: this.lat, lng: this.lng }
  destination: Location = { lat: this.lat, lng: this.lng };
  destinationCoordinates: Location;

  @ViewChild('destinationFormInput') destinationInputElement: ElementRef;

  // input fields
  destinationInputField;
  capacity = 1;
  mouseoverCreateButton

  constructor(
    private googleMapsService: GoogleMapsService,
    private routeService: RouteService,
    private createRouteHelper: CreateRouteHelper,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.googleMapsService
      .loadGoogleMaps(this.destinationInputElement.nativeElement);
  }

  async showRouteDirectionOnClick() {
    const addressInput = this.destinationInputElement.nativeElement.value;
    const coordinates = await this.googleMapsService
      .getLocationCoordinatesFromAddress(addressInput);
    this.updateRouteDisplay(coordinates);
  }

  async updateDestinationFieldOnMarkerDrag(marker, $event) {
    const locationAddress = await this.googleMapsService
      .getLocationAddressFromCoordinates($event.coords);
    this.destinationInputField = locationAddress;
    this.updateRouteDisplay($event.coords);
  }

  clearDestinationCoordinates() {
    this.destinationCoordinates = null;
  }

  updateRouteDisplay(coordinates) {
    this.destination = coordinates; // update map marker
    this.destinationCoordinates = coordinates;
    this.toggleMapDisplay();
  }

  toggleMapDisplay() {
    this.destinationIsDojo = true;
    this.destinationIsDojo = false;
  }

  changeCapacityValue(methodToCall: string, valueToIncrement: any) {
    this.capacity = this.createRouteHelper[methodToCall](valueToIncrement);
  }

  createRoute(formValues) {
    if(!this.destinationCoordinates) {
      return this.createRouteHelper.notifyUser(
        ['Click the search icon to confirm destination']
      );
    }

    const routeRequest = this.createRouteHelper.createNewRouteRequestObject(
      formValues, this.destinationInputField, this.destinationCoordinates
    );

    const errors = this.createRouteHelper.validateFormEntries(routeRequest);
    if(errors.length) {
      return this.createRouteHelper.notifyUser(errors);
    }

    return this.sendRequestToServer(routeRequest);
  }

  async sendRequestToServer(data) {
    try {
      const response = await this.routeService.createRoute(data);
      this.createRouteHelper.notifyUser([response.message], 'success');
      this.router.navigate(['/admin/routes/inventory']);
    } catch (e) {
      this.createRouteHelper.notifyUser([e.error.message || 'An error occurred.']);
    }
  }
}
