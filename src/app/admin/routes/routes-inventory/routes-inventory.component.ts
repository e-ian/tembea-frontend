import { Component, OnInit } from '@angular/core';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IRouteInventory, IDeleteRouteResponse } from 'src/app/shared/models/route-inventory.model';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import RenameRouteBatch from './routes-inventory.helper';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: ['./routes-inventory.component.scss'],
})
export class RoutesInventoryComponent implements OnInit {
  routes: IRouteInventory[] = [];
  pageNo: number;
  pageSize: number;
  sort: string;
  totalItems: number;
  lastBatchLetter = 'A';
  lastRouteName: string;

  constructor(
    private routeService: RoutesInventoryService,
    private alert: AlertService,
    private dialog: MatDialog,
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.getRoutesInventory();
  }

  getRoutesInventory = () => {
    this.routeService.getRoutes(this.pageSize, this.pageNo, this.sort).subscribe(routesData => {
      const { routes, pageMeta } = routesData;
      this.routes = this.renameRouteBatches(routes);
      this.totalItems = pageMeta.totalResults;
    });
  };

  renameRouteBatches(routes) {
    const renameBatchesObject = new RenameRouteBatch(routes, this.lastRouteName, this.lastBatchLetter);
    const renamedBatches = renameBatchesObject.renameRouteBatches();
    const { name, batch } = renamedBatches[renamedBatches.length - 1];
    this.lastRouteName = name;
    this.lastBatchLetter = batch;
    return renamedBatches;
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getRoutesInventory();
  }

  changeRouteStatus(id: number, status: string) {
    this.routeService.changeRouteStatus(id, { status })
      .subscribe((response) => {
        if (response.success) {
          this.updateRoutesData(id, status);
        }
      }, () => this.alert.error('Something went wrong! try again'));
  }

  updateRoutesData(id: number, status: string): void {
    this.routes = this.routes.map((route) => {
      if (route.id === id) {
        route = { ...route, status };
      }
      return route;
    });
  }

  async deleteRoute(routeBatchId: number, ind: number) {
    this.routeService.deleteRouteBatch(routeBatchId)
      .subscribe((response: IDeleteRouteResponse) => {
        const { success, message } = response;
        if (success) {
          this.alert.success(message);
          const routes = [...this.routes];
          routes.splice(ind, 1);
          this.routes = this.renameRouteBatches(routes);
        } else { this.alert.error(message) }
      }, (error: any) => this.alert.error('Something went wrong! try again'))
  }

  showDeleteModal(routeBatchId: number, ind: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'logout-modal-panel-class',
      data: {
        confirmText: 'yes',
        displayText: 'delete this batch'
       }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
      this.deleteRoute(routeBatchId, ind)
    })
  }
}
