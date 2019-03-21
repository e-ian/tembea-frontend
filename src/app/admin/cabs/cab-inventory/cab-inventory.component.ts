import { Component, OnInit } from '@angular/core';
import { CABS_ITEMS_PER_PAGE } from 'src/app/app.constants';

import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { ICabInventory } from 'src/app/shared/models/cab-inventory.model';
import { AppEventService } from 'src/app/shared/app-events.service';

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
  pageNo: number;
  pageSize: number;
  totalItems: number;
  sort: string;
  isLoading: boolean;
  displayText = 'No cabs yet';

  constructor(
    public cabService: CabsInventoryService,
    private appEventsService: AppEventService,
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = CABS_ITEMS_PER_PAGE;
    this.isLoading = true;
  }

  ngOnInit() {
    this.getCabsInventory();
  }

  getCabsInventory = () => {
    this.isLoading = true;
    this.cabService.getCabs(this.pageSize, this.pageNo, this.sort).subscribe(cabsData => {
      const {
        cabs,
        pageMeta: {
          totalResults
        }
      } = cabsData;
      this.totalItems = totalResults;
      this.cabs = cabs;
      this.isLoading = false;
      this.appEventsService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: totalResults } })
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

}
