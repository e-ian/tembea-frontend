import { Component, OnInit } from '@angular/core';
import { TripRequestService } from '../../__services__/trip-request.service';
import { TripRequest } from 'src/app/shared/models/trip-request.model';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';


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
  dateFilters = {
    requestedOn: {},
    departureTime: {},
  };
  departmentName: string;
  filterParams: any;


  constructor(
    private tripRequestService: TripRequestService,
    private appEventService: AppEventService,
    private alertService: AlertService,
  ) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
  }

  ngOnInit() {
    this.getTrips();
    this.getDepartments();
  }

  getDepartments() {
    this.tripRequestService.getDepartments()
      .subscribe(departmentsData => this.departmentsRequest = departmentsData);
  }

  getTrips() {
    const { page, pageSize: size, departmentName: department, dateFilters } = this;
    this.tripRequestService.query({ page, size, status: 'Confirmed', department, dateFilters })
      .subscribe(tripData => {
        const { pageInfo, trips } = tripData;
        this.tripRequests = trips;
        this.totalItems = pageInfo.totalResults;
        this.appEventService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: pageInfo.totalResults } });
      }, () => {
        this.alertService.error('Error occured while retrieving data');
      });
  }

  updatePage(page) {
    this.page = page;
    this.getTrips();
  }

  setDateFilter(field: string, range: 'before' | 'after', date: string) {
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    this.getTrips();
  }

  departmentSelected($event) {
    this.departmentName = $event;
    this.getTrips();
  }

  setFilterParams() {
    const { dateFilters, departmentName } = this;
    this.filterParams = {
      dateFilters, department: departmentName
    };
  }
}
