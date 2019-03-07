import {Component, OnInit} from '@angular/core';
import {TripRequestService} from '../../__services__/trip-request.service';
import {TripRequest} from 'src/app/shared/models/trip-request.model';
import {ITEMS_PER_PAGE} from 'src/app/app.constants';


@Component({
  selector: 'app-trip-itinerary',
  templateUrl: './trip-itinerary.component.html',
  styleUrls: ['../../routes/routes-inventory/routes-inventory.component.scss', './trip-itinerary.component.scss', ],
})
export class TripItineraryComponent implements OnInit {
  tripRequests: TripRequest[] = [];
  departmentsRequest: any = [];
  page: number;
  pageSize: number;
  totalItems: number;
  departmentName: string;


  constructor(private tripRequestService: TripRequestService) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
  }

  ngOnInit() {
    this.getTrips();
    this.getDepartments();
  }
  getDepartments() {
    this.tripRequestService.getDepartments().subscribe(departmentsData => this.departmentsRequest = departmentsData );
  }

  getTrips(params?: object) {
    const { page, pageSize: size} = this;
      this.tripRequestService.query({ page, size, ...params}).subscribe(tripData => {
      const {pageInfo, trips} = tripData;
      this.tripRequests = trips;
      this.totalItems = pageInfo.totalResults;
  });
  }

  updatePage(page) {
    this.page = page;
    this.getTrips();
  }

  departmentSelected($event) {
    this.departmentName = $event;
    this.getTrips({ department: this.departmentName });
  }

}


