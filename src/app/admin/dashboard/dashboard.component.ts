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
  averageRatings: number;
  minDate: any;
  startingDate: any;
  tripsData: Array<ITripsDataModel> = [];
  totalCost: number;
  riders$: Observable<IRider[]> = this.riderService.getRiders();

  constructor(
    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService,
    private tripService: TripsDataService,
    private riderService: RiderService
  ) { }

  ngOnInit() {
    const date = new Date;
    const currentDate = moment(date).format('YYYY-MM-DD');
    this.dateFilters = {from: {}, to: {}, startDate: {from: currentDate}, endDate: {to: currentDate}};
    this.getRoutesUsage();
    this.getRouteRatings();
    this.getTripsData();
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

  calculateAverage(tripData: ITripsDataModel[]) {
    const avgTotal = tripData.reduce((acc, el) => {
      return acc + +el.averageRating;
    }, 0);
    const widthInPercentage = +((avgTotal / tripData.length) * 100).toFixed(1);
    if (tripData.length === 0) {
      return this.averageRatings = 0;
    }
    this.averageRatings = widthInPercentage / 5;
  }
  getTripsData() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.tripService.getTripData(this.dateFilters).subscribe(res => {
        const { data } = res;
        this.tripsData = data;
        this.totalCost = this.getTotalCost(data);
        this.calculateAverage(data);
      });
    }
  }

  getTotalCost(tripData: Array<ITripsDataModel>) {
    const totalCost = tripData.reduce((acc, el) => {
      return acc + +el.totalCost;
    }, 0);
    return totalCost;
  }

}
