import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
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

  @Input() tripRequestType: string;

  tripType: string;
  tripRequests: TripRequest[] = [];
  departmentsRequest: any = [];
  page: number;
  pageSize: number;
  totalItems: number;
  dateFilters = {
    requestedOn: {},
    departureTime: {},
  };
  status: string;
  departmentName: string;
  rating: number;
  filterParams: any;
  passedParams = {};


  constructor(
    private tripRequestService: TripRequestService,
    private appEventService: AppEventService,
    private alertService: AlertService,
  ) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
    this.tripType = 'Regular Trip';
    this.status = 'Confirmed'
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
    const { page, pageSize: size, departmentName: department, rating,  dateFilters } = this;

    this.passedParams = {page, size, status: this.status, department, rating, type: this.tripType, dateFilters }

    if (this.tripRequestType) {
      this.passedParams = {page, size, status: this.status, department,
        rating, type: this.tripType, dateFilters, currentDay: 'Call Current date' }
    }
    this.tripRequestService.query(this.passedParams)
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
    const currentDate = moment().format('YYYY-MM-DD');
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    const timeOfDeparture = moment(date).format('YYYY-MM-DD');
    if (this.tripRequestType && timeOfDeparture < currentDate) {
      this.dateFilters = {
        requestedOn: {},
        departureTime: {},
      };
    }

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
