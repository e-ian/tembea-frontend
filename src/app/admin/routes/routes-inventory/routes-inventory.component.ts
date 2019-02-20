import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IRouteInventory, IDeleteRouteResponse } from 'src/app/shared/models/route-inventory.model';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import RenameRouteBatch from './routes-inventory.helper';
import { RoutesInventoryEditModalComponent } from './routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: ['./routes-inventory.component.scss'],
})
export class RoutesInventoryComponent implements OnInit, OnDestroy {
  routes: IRouteInventory[] = [];
  pageNo: number;
  pageSize: number;
  sort: string;
  totalItems: number;
  lastBatchLetter = 'A';
  lastRouteName: string;
  updateSubscription: any;

  constructor(
    private routeService: RoutesInventoryService,
    private alert: AlertService,
    public dialog: MatDialog,
    private appEventsService: AppEventService
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = ITEMS_PER_PAGE;
  }

  ngOnInit() {
    this.getRoutesInventory();
    this.updateSubscription = this.appEventsService.subscribe('updateRouteInventory', () => {
      this.getRoutesInventory()
    })

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
  editRoute(index): void {
    this.dialog.open(RoutesInventoryEditModalComponent, {
      data: <IRouteInventory>{
        id: this.routes[index].id,
        status: this.routes[index].status,
        takeOff: this.routes[index].takeOff,
        capacity: this.routes[index].capacity,
        batch: this.routes[index].batch,
        inUse: this.routes[index].inUse,
        name: this.routes[index].name,
        regNumber: this.routes[index].regNumber
      }
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe()
    }

  }
}
