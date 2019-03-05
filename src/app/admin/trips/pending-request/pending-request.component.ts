import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TripRequestService } from '../../__services__/trip-request.service';
import { TripRequest } from '../../../shared/models/trip-request.model';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  selector: 'app-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss', '../../routes/routes-inventory/routes-inventory.component.scss'],
})
export class PendingRequestComponent implements OnInit, OnDestroy {
  tripRequests: TripRequest[] = [];
  error: any;
  routeData: Subscription;
  success: any;
  page: number;
  previousPage: any;
  pageSize: number;
  totalItems: number;

  constructor(private tripRequestService: TripRequestService,
              private activatedRoute: ActivatedRoute,
              private appEventService: AppEventService
  ) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
    this.routeData = this.activatedRoute.data.subscribe((data) => {
      const { pagingParams } = data;
      if (pagingParams) {
        this.page = pagingParams.page;
        this.previousPage = pagingParams.page;
      }
    });
  }

  loadAll() {
    const { page, pageSize: size } = this;
    this.tripRequestService.query({ page, size, status: 'Approved' }).subscribe(tripData => {
      this.tripRequests = tripData.trips;
      this.totalItems = tripData.pageInfo.totalResults;
      this.appEventService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: this.totalItems } });
    });
  }

  ngOnInit() {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.routeData.unsubscribe();
  }

  updatePage(page) {
    this.page = page;
    this.loadAll();
  }
}
