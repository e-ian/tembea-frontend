import { Component, OnInit } from '@angular/core';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { MatDialog } from '@angular/material';

import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { ICabInventory } from 'src/app/shared/models/cab-inventory.model';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cabs',
  templateUrl: './cab-inventory.component.html',
  styleUrls: [
    './cab-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})

export class CabInventoryComponent implements OnInit {
  cabs: ICabInventory[] = [];
  providerId: any;
  providerName: any;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  sort: string;
  isLoading: boolean;
  displayText = 'No cabs yet';
  createVehicleText = 'Add a New Vehicle';
  currentOptions = -1;
  updateSubscription: any;
  vehiclesSubscription: any;
  params: any;


  constructor(
    public cabService: CabsInventoryService,
    private appEventsService: AppEventService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
  }

  ngOnInit() {
    this.vehiclesSubscription = this.activatedRoute.params.subscribe(
      data => this.updateCabs.call(this, data)
    );
    this.updateSubscription = this.appEventsService.subscribe(
      'newCab', () => this.getCabsInventory.call(this)
    );
  }

  getCabsInventory (): void {
    this.isLoading = false;
    this.currentOptions = -1;
    this.loadCabs(this.pageSize, this.pageNo, this.sort, this.providerId);
  }

  updateCabs (data): void {
    const { providerName, providerId } = data;
    this.providerName = providerName;
    this.providerId = providerId;
    if (!this.providerId) {return; }
    this.loadCabs(this.pageSize, this.pageNo, this.sort, this.providerId);
  }

  loadCabs (size, page, sort, providerId): void {
    this.cabService.getCabs(size, page, sort, providerId ).subscribe(cabsData => {
        const {
          cabs,
          pageMeta: { totalResults }
        } = cabsData;
        this.totalItems = totalResults;
        this.cabs = cabs;
        this.isLoading = false;
        this.appEventsService.broadcast({
          name: 'updateHeaderTitle',
          content: {
            badgeSize: totalResults,
            actionButton: this.createVehicleText,
            headerTitle: `${this.providerName} Vehicles`,
            providerId: this.providerId
          }
        });
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }
  setPage(page: number): void {
    this.pageNo = page;
    this.getCabsInventory();
  }

  showOptions(cabId) {
    this.currentOptions = this.currentOptions === cabId ? -1 : cabId;
  }
}
