import { Component, OnInit, Inject } from '@angular/core';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IRouteInventory } from 'src/app/shared/models/route-inventory.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: ['./routes-inventory.component.scss'],
})
export class RoutesInventoryComponent implements OnInit {
  routes: IRouteInventory[] = [];
  totalPages: number;
  pageNo: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  sort: string = 'name,asc';
  groupSize: number = 4;
  currentPageGroup: number = 0;
  errorMessage: string;

  constructor(private routeService: RoutesInventoryService) {}

  ngOnInit() {
    this.getRoutesInventory();
  }

  getRoutesInventory = () => {
    this.routeService.getRoutes(this.pageSize, this.pageNo, this.sort).subscribe(routesData => {
      const { routes, pageMeta } = routesData;
      this.routes = routes;
      this.totalPages = pageMeta.totalPages;
      this.pageSize = pageMeta.pageSize;
      this.pages = this.getPages();
    });
  };

  getPages(): any {
    const pages = [];
    const groupededPages = [];

    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    while (pages.length) {
      groupededPages.push(pages.splice(0, this.groupSize));
    }
    return groupededPages;
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getRoutesInventory();
  }

  nextGroup(): void {
    this.currentPageGroup += 1;
  }

  prevGroup(): void {
    this.currentPageGroup -= 1;
  }
}
