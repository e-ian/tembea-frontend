import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';
import { TripsDataService } from '../__services__/trips-data.service';
import { ITripsDataModel } from '../../shared/models/trips-data.model';
import { RiderService } from './rider-list/rider.service';
import { IRider } from '../../shared/models/rider.model';
import { Observable } from 'rxjs/Observable';
import { DepartmentsService } from '../__services__/departments.service';

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
  departments: string[] = [];
  numOfTrips: Array<number> = [];
  departmentNames: Array<string> = [];
  totalCostPerDept: any[];
  tripsDataSet: { labels: string[], travel: any[] } = {
    labels: [],
    travel: [
      {
        data: [],
        label: 'Airport Transfers',
        tripsCost: [],
      },
      {
        data: [],
        label: 'Embassy Visits',
        tripsCost: [],
      },
    ],
  };
  tripData: { trip: any[], tripsCost: number[], departmentNames: string[] } = {
    trip: [
      {
        label: 'Line Dataset',
        data: [],
        type: 'line'
      },
      {
        data: [],
        label: 'Trips',
        type: 'bar'
      },
    ],
    tripsCost: [],
    departmentNames: []
  };

  constructor(
    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService,
    private tripService: TripsDataService,
    private riderService: RiderService,
    private departmentsService: DepartmentsService,
  ) { }

  ngOnInit() {
    const date = new Date;
    const currentDate = moment(date).format('YYYY-MM-DD');
    this.dateFilters = { from: {}, to: {}, startDate: { from: currentDate }, endDate: { to: currentDate } };
    this.getRoutesUsage();
    this.getRouteRatings();
    this.getTripsData();
    this.getAirportTransfers();
    this.getEmbassyVisits();
    this.getTripsAnalysis();
    this.dateFilters = { from: {}, to: {}, startDate: { from: '' }, endDate: { to: '' } };
    this.getDepartments();
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

  callTripService(tripType = '') {
    return this.tripService.getTripData(this.dateFilters, tripType);
  }

  totalTripsCount(tripsData: Array<ITripsDataModel>): number {
    const totalVisits = tripsData.reduce((prev, next) => prev + Number(next.totalTrips), 0);
    return totalVisits;
  }

  getTripsData() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.callTripService().subscribe(res => {
        const { data: { trips, finalCost, finalAverageRating, count } } = res;
        this.tripsData = trips;
        this.totalCost = finalCost || 0;
        this.averageRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
        this.plotBarChart(trips);
      });
    }
  }

  getAirportTransfers() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.callTripService('Airport Transfer').subscribe(res => {
        const { data: { finalAverageRating, trips } } = res;
        this.airportRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
        this.totalAirportTrips = this.totalTripsCount(trips);
        this.plotTravelTripsAnalytics(trips, 0);
      });
    }
  }

  getEmbassyVisits() {
    if (this.dateFilters.startDate.from && this.dateFilters.endDate.to) {
      this.tripService.getTripData(this.dateFilters, 'Embassy Visit').subscribe(res => {
        const { data: { trips, finalAverageRating } } = res;
        this.averageEmbassyRatings = finalAverageRating * 20; // convert to percentage then divide by 5 for the 5 stars
        this.EmbassyVisits = this.totalTripsCount(trips);
        this.plotTravelTripsAnalytics(trips, 1);
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

  getDepartments() {
    this.departmentsService.get(5, 1).subscribe(res => {
      const weekOfMonth = this.getWeekOfMonth(this.dateFilters.startDate.from);
      const departments = res.departments.map(department => department.name);

      this.tripsDataSet.labels = [weekOfMonth, ...departments];
      this.tripData.departmentNames = [...departments];

      const labelsLength = this.tripsDataSet.labels.length;
      const tripLabelLength = this.tripData.departmentNames.length;

      const zeroData = new Array(labelsLength).fill(0);
      const tripZeroData = new Array(tripLabelLength).fill(0);

      this.tripsDataSet.travel[0].data = [...zeroData];
      this.tripsDataSet.travel[0].tripsCost = [...zeroData];
      this.tripsDataSet.travel[1].data = [...zeroData];
      this.tripsDataSet.travel[1].tripsCost = [...zeroData];

      this.tripData.tripsCost = [...tripZeroData];
      this.tripData.trip[0].data = [...tripZeroData];
      this.tripData.trip[1].data = [...tripZeroData];
    });
  }

  getWeekOfMonth(date: string) {
    const selectedDate = moment(date);
    const weekOfMonth = `Week ${Math.ceil(selectedDate.date() / 7)}`;
    return weekOfMonth;
  }

  plotTravelTripsAnalytics(trips, dataIndex: number) {
    const onlyUnique = (value, index, self) => self.indexOf(value) === index;
    let labels = [...this.tripsDataSet.labels];
    trips.map(trip => {
      if (labels.indexOf(trip.departmentName) === -1) {
        this.departments.push(trip.departmentName);
        const [weekOfMonth, ...dataLabels] = labels;
        labels = [weekOfMonth, ...this.departments, ...dataLabels].filter(onlyUnique);
      }

      const index = labels.indexOf(trip.departmentName);
      const newTravelData = [...this.tripsDataSet.travel[dataIndex].data];
      const newTravelCost = [...this.tripsDataSet.travel[dataIndex].tripsCost];

      newTravelData[index] = parseInt(trip.totalTrips, 0);
      newTravelCost[index] = parseInt(trip.totalCost || 0, 0);

      this.tripsDataSet.travel[dataIndex].data = [...newTravelData];
      this.tripsDataSet.travel[dataIndex].tripsCost = [...newTravelCost];
    });

    if (labels.length > 6) {
      labels.length = 6;
    }
    this.tripsDataSet.labels = labels;
  }

  plotBarChart(tripData): any {
    const newTotalCost = [];
    const newTotalTrip = [];

    const onlyUnique = (value, index, self) => self.indexOf(value) === index;

    let labels = [...this.tripData.departmentNames];
    tripData.map(tripInfo => {
      if (labels.indexOf(tripInfo.departmentName) === -1) {
        this.departments.push(tripInfo.departmentName);
        const [...dataLabels] = labels;
        labels = [...this.departments, ...dataLabels].filter(onlyUnique);
      }

      newTotalCost.push(+tripInfo.totalCost);
      newTotalTrip.push(+tripInfo.totalTrips);
    });

    this.tripData.trip[1].data = newTotalTrip;
    this.tripData.tripsCost = this.tripData.trip[0].data = newTotalCost;

    if (labels.length > 5) {
      labels.length = 5;
    }
    this.tripData.departmentNames = labels;
  }
}
