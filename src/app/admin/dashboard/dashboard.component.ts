import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripsDataService } from '../__services__/trips-data.service';
import { ITripsDataModel } from '../../shared/models/trips-data.model';
import { RiderService } from './rider-list/rider.service';
import { IRider } from '../../shared/models/rider.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  dateFilters = {
    from: {},
    to: {},
    startDate: { from: '' },
    endDate: { to: '' }
  };
  mostUsedRoute: Object = {};
  leastUsedRoute: Object = {};
  mostRatedRoutes = [];
  leastRatedRoutes = [];
  maxDate = new Date();
  averageRatings = 0;
  minDate: any;
  startingDate: any;
  tripsData: Array<ITripsDataModel> = [];
  totalCost: number;
  riders$: Observable<IRider[]> = this.riderService.getRiders();
  airportRatings: number;
  totalAirportTrips: number;
  averageEmbassyRatings: any;
  EmbassyVisits: number;
  normalTripCount: number;
  travelTripCount: number;

  constructor(

    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService,
    private tripService: TripsDataService,
    private riderService: RiderService
  ) {}

  ngOnInit() {
    const date = new Date;
    const currentDate = moment(date).format('YYYY-MM-DD');
    this.dateFilters = {from: {}, to: {}, startDate: {from: currentDate}, endDate: {to: currentDate}};
    this.getRoutesUsage();
    this.getRouteRatings();
    this.getTripsData();
    this.getAirportTransfers();
    this.getEmbassyVisits();
    this.getTripsAnalysis();
    this.dateFilters = {from: {}, to: {}, startDate: {from: ''}, endDate: {to: ''}};
   }


  setDateFilter(field: string, range: 'from' | 'to', date: string) {
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    this.getRoutesUsage();
    this.getRouteRatings();
    this.startingDate = this.dateFilters.startDate.from ? moment(this.dateFilters.startDate.from).format('YYYY-MM-DD') : '';
    this.minDate = this.startingDate;
    this.getTripsData();
    this.getAirportTransfers();
    this.getEmbassyVisits();
    this.getTripsAnalysis();
  }

  getRoutesUsage() {
    this.routeUsageService.getRouteUsage(this.dateFilters).subscribe(routeUsageData => {
      const { mostUsedBatch, leastUsedBatch } = routeUsageData;
      const mostUsed = mostUsedBatch.emptyRecord ? { ...mostUsedBatch.emptyRecord } : { ...mostUsedBatch };
      const leastUsed = leastUsedBatch.emptyRecord ? { ...leastUsedBatch.emptyRecord } : { ...leastUsedBatch };
      this.mostUsedRoute = mostUsed;
      this.leastUsedRoute = leastUsed;
    });
  }

  getRouteRatings() {
    if (this.dateFilters.from && this.dateFilters.to) {
      this.ratingsService.getRouteAverages(this.dateFilters).subscribe(res => {
        const { data } = res;
        this.mostRatedRoutes = data.slice(0, 3);
        this.leastRatedRoutes = data.sort((a, b) => a.Average - b.Average).slice(0, 3);
      });
    }
  }

  callTripService(tripType= '') {
    return this.tripService.getTripData(this.dateFilters, tripType);
  }

  totalTripsCount(tripsData: Array<ITripsDataModel>): number {
    const totalVisits = tripsData.reduce((prev, next) => prev + Number(next.totalTrips), 0);
    return totalVisits;
  }

  getTripsData() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.callTripService().subscribe(res => {
        const { data: { trips, finalCost, finalAverageRating, count} } = res;
        this.tripsData = trips;
        this.totalCost = finalCost || 0;
        this.averageRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
      });
    }
  }

  getAirportTransfers() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.callTripService('Airport Transfer').subscribe(res => {
        const { data: { finalAverageRating, trips} } = res;
        this.airportRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
        this.totalAirportTrips = this.totalTripsCount(trips);
      });
    }
  }
  getEmbassyVisits() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.tripService.getTripData(this.dateFilters, 'Embassy Visit').subscribe(res => {
        const { data: { trips, finalAverageRating } } = res;
        this.averageEmbassyRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
        this.EmbassyVisits = this.totalTripsCount(trips);
      });
    }
  }

  getTripsAnalysis() {
    if (this.dateFilters.from && this.dateFilters.to) {
      this.tripService.getTravelData(this.dateFilters).subscribe(res => {
        const { data: { trips } } = res;
        this.travelTripCount = this.totalTripsCount(trips);
      });
      this.tripService.getTripData(this.dateFilters, 'Regular Trip').subscribe(res => {
        const { data: { trips } } = res;
        this.normalTripCount = this.totalTripsCount(trips);
      });
    }
  }
}
