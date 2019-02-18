import { Component, OnInit, Inject } from '@angular/core';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IRouteInventory } from 'src/app/shared/models/route-inventory.model';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: ['./routes-inventory.component.scss'],
})
export class RoutesInventoryComponent implements OnInit {
  routes: IRouteInventory[] = [];
  totalPages: number;
  pageNo = 1;
  pageSize = 10;
  pages: number[] = [];
  sort = 'name,asc';
  groupSize = 4;
  currentPageGroup = 0;
  errorMessage: string;

  constructor(
    private routeService: RoutesInventoryService,
    private alert: AlertService
  ) {}

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
    const groupedPages = [];

    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    while (pages.length) {
      groupedPages.push(pages.splice(0, this.groupSize));
    }
    return groupedPages;
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

  changeRouteStatus(id: number, status: string) {
    this.routeService.changeRouteStatus(id, { status })
      .subscribe((response) => {
        if (response.success) {
          this.updateRoutesData(id, status);
        }
      }, (err: any) => this.alert.error('Something went wrong! try again'))
  }

  updateRoutesData(id: number, status: string): void {
    const newData = this.routes.map((route) => {
      if (route.id === id) {
        route = { ...route, status }
      }
      return route
    });
    this.routes = newData;
  }
}
