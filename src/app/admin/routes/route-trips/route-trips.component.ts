import { Component, OnInit } from '@angular/core';
import { IRouteTrips } from '../../../shared/models/route-trips.model';
import { RouteTripsService } from '../../../admin/__services__/route-trips.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-route-trips',
  templateUrl: './route-trips.component.html',
  styleUrls: ['./route-trips.component.scss']
})
export class RouteTripsComponent implements OnInit {
  page: number;
  pageSize: number;
  totalItems: number;
  routeTrips: IRouteTrips[] = [];
  isLoading: boolean;

  constructor(
    private routeTripsService: RouteTripsService,
    private appEventsService: AppEventService
    ) {
    this.page = 1;
    this.pageSize = 10;
  }

  ngOnInit() {
    this.setPage(this.page);
  }

  getRouteTrips() {
    this.isLoading = true;
    const { page, pageSize } = this;
    this.routeTripsService.getBatchTripsRecords({ page, pageSize })
    .subscribe(data => {
      this.routeTrips = data.data;
      this.totalItems = data.pageMeta.totalItems;
      this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: this.totalItems } });
      this.isLoading = false;
    });
  }

  setPage(page: number): void {
    this.page = page;
    this.getRouteTrips();
  }

}
