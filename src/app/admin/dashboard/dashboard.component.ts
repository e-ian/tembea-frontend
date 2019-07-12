import { Component, OnInit } from '@angular/core';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripRatingsService } from '../__services__/trip-ratings.service';
import * as moment from 'moment';
import { ITripRatingModel } from 'src/app/shared/models/trip-ratings.model';

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

  constructor(
    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService,
    private tripRatingsService: TripRatingsService
  ) { }

  ngOnInit() {
    const date = new Date;
    const currentDate = moment(date).format('YYYY-MM-DD');
    this.dateFilters = { from: {}, to: {}, startDate: { from: currentDate }, endDate: { to: currentDate } };
    this.getRoutesUsage();
    this.getRouteRatings();
    this.tripAverageRating();
  }


  setDateFilter(field: string, range: 'from' | 'to', date: string) {
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    this.getRoutesUsage();
    this.getRouteRatings();
    this.tripAverageRating();
    this.startingDate = this.dateFilters.startDate.from ? moment(this.dateFilters.startDate.from).format('YYYY-MM-DD') : '';
    this.minDate = this.startingDate;
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

  tripAverageRating() {
    if (this.dateFilters.from && this.dateFilters.to) {
      this.tripRatingsService.getTripData(this.dateFilters).subscribe(
        rating => {
          this.calculateAverage(rating.data);
        }
      );
    }
  }

  calculateAverage(rating: ITripRatingModel[]) {
    const avgTotal = rating.reduce((acc, el) => {
      return acc + +el.averageRating;
    }, 0);
    const widthInPercentage = +((avgTotal / rating.length) * 100).toFixed(1);
    if (rating.length === 0) {
      return this.averageRatings = 0;
    }
    this.averageRatings = widthInPercentage / 5;
  }
}
