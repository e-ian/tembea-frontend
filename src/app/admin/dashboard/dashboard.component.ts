import { Component, OnInit } from '@angular/core';
import { RouteUsageService } from '../__services__/route-usage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  dateFilters = {
    from: {},
    to: {},
  };
  mostUsedRoute: Object = {};
  leastUsedRoute: Object = {};

  constructor(
    private routeUsageService: RouteUsageService
  ) { }

  ngOnInit() {
    this.getRoutesUsage();
   }


  setDateFilter(field: string, range: 'from' | 'to', date: string) {
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    this.getRoutesUsage();
  }

  getRoutesUsage() {
    this.routeUsageService.getRouteUsage(this.dateFilters).subscribe(routeUsageData => {
      const { mostUsedBatch, leastUsedBatch } = routeUsageData
      const mostUsed = mostUsedBatch.emptyRecord ? { ...mostUsedBatch.emptyRecord } : { ...mostUsedBatch }
      const leastUsed = leastUsedBatch.emptyRecord ? { ...leastUsedBatch.emptyRecord } : { ...leastUsedBatch }
      this.mostUsedRoute = mostUsed;
      this.leastUsedRoute = leastUsed;

    })
  }
}
