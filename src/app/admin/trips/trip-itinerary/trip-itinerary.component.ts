import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import * as moment from 'moment';
import { TripRequestService } from '../../__services__/trip-request.service';
import { TripRequest } from 'src/app/shared/models/trip-request.model';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayTripModalComponent } from '../display-trip-modal/display-trip-modal.component';
import { ProviderService } from '../../__services__/providers.service';



@Component({
  selector: 'app-trip-itinerary',
  templateUrl: './trip-itinerary.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    './trip-itinerary.component.scss',
    '../../travel/airport-transfers/airport-transfers.component.scss'
  ],
})
export class TripItineraryComponent implements OnInit {

  @Input() tripRequestType: string;

  @Input() tripType: string;
  tripRequests: TripRequest[] = [];
  departmentsRequest: any = [];
  page: number;
  pageSize: number;
  totalItems: number;
  dateFilters = {
    requestedOn: {},
    departureTime: {},
  };
  status = 'Confirmed';
  departmentName: string;
  rating: number;
  filterParams: any;
  passedParams = {};
  state = 'Approved/Confirmed';
  loading: boolean;
  @Output()
  tripTotalEventEmitter = new EventEmitter();
  noCab = false;

  constructor(
    private tripRequestService: TripRequestService,
    public appEventService: AppEventService,
    private alertService: AlertService,
    public dialog: MatDialog,
    public providerService: ProviderService
  ) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
    this.tripType = 'Regular Trip';
  }
  ngOnInit() {
    switch (this.tripRequestType) {
      case 'declinedTrips':
        this.state = 'Declined';
        this.status = 'DeclinedByOps';
        break;
      case 'pastTrips':
        this.status = null;
        break;
      case 'pending':
        this.status = 'Pending';
        break;
      case 'awaitingProvider':
        this.noCab = true;
        this.status = null;
        this.tripType = null;
        break;
      case 'all':
        this.status = null;
        break;
      default:
        this.status = 'Confirmed';
        break;
    }
    this.getTrips(this.status);
    this.getDepartments();
  }

  getDepartments() {
    this.tripRequestService.getDepartments()
      .subscribe(departmentsData => this.departmentsRequest = departmentsData);
  }

  getPastTrips(trips: TripRequest[]): TripRequest[] {
    const removeStatus = ['Cancelled', 'DeclinedByOps', 'DeclinedByManager'];
    return trips.filter((trip) => {
      return ((moment(trip.departureTime) < moment()) && !removeStatus.some(v => v === trip.status)) || (trip.status === 'Completed');
    });
  }

  getTrips(status = 'Confirmed') {
    this.loading = true;
    const tripStatus = this.tripRequestType === 'pastTrips' ? null : status;
    const { page, pageSize: size, departmentName: department, dateFilters } = this;
    this.tripRequestService.query({ page, size, status: tripStatus, department, type: this.tripType, dateFilters, noCab: this.noCab })
      .subscribe(tripData => {
        const { pageInfo, trips } = tripData;
        let newTrips = trips;
        if (this.tripRequestType === 'pastTrips') {
          newTrips = this.getPastTrips(trips);
        }
        this.tripRequests = newTrips;
        this.totalItems = newTrips.length;
        if (this.tripRequestType === 'all' || this.tripRequestType === 'confirmed') {
          this.appEventService.broadcast({
            name: 'updateHeaderTitle',
            content: { badgeSize: pageInfo.totalResults, tooltipTitle: 'All Trips' }
          });
        }
        this.tripTotalEventEmitter.emit({ totalItems: this.totalItems, tripRequestType: this.tripRequestType });
        this.loading = false;
      }, () => {
        this.alertService.error('Error occured while retrieving data');
      });
  }

  updatePage(page) {
    this.page = page;
    this.getTrips(this.status);
  }

  setDateFilter(field: string, range: 'before' | 'after', date: string) {
    const currentDate = moment().format('YYYY-MM-DD');
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    const timeOfDeparture = moment(date).format('YYYY-MM-DD');
    if (this.tripRequestType === 'upcomingTrips' && timeOfDeparture < currentDate) {
      this.dateFilters = {
        requestedOn: {},
        departureTime: {},
      };
    }

    this.getTrips(this.status);
  }

  departmentSelected($event) {
    this.departmentName = $event;
    this.getTrips(this.status);
  }

  setFilterParams() {
    const { dateFilters, departmentName } = this;
    this.filterParams = {
      dateFilters, department: departmentName
    };
  }

  viewTripDescription(trip: any) {
    this.dialog.open(DisplayTripModalComponent, {
      height: '660px',
      width: '592px',
      data: {
        tripInfo: trip,
        closeText: 'Close'
      }
    });
  }

  checkTripRequestType(tripRequestType: string): boolean {
    return this.tripRequestType === tripRequestType;
  }
}
