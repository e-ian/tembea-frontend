import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import { IDeleteRouteResponse, IRouteInventory } from 'src/app/shared/models/route-inventory.model';
import { AlertService } from '../../../shared/alert.service';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import RenameRouteBatch from './routes-inventory.helper';
import { RoutesInventoryEditModalComponent } from './routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AppHeaderService } from '../../header/header.service';
import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { CreateRouteHelper } from '../create-route/create-route.helper';

@Component({
  selector: 'app-inventory',
  templateUrl: './routes-inventory.component.html',
  styleUrls: [
    './routes-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ],
})
export class RoutesInventoryComponent implements OnInit, OnDestroy {
  routes: IRouteInventory[] = [];
  pageNo: number;
  pageSize: number;
  sort: string;
  totalItems: number;
  lastRoute
  updateSubscription: any;
  duplicate = true;
  navigationSubscription;
  isLoading: boolean;

  constructor(
    private routeService: RoutesInventoryService,
    private alert: AlertService,
    private headerService: AppHeaderService,
    private appEventsService: AppEventService,
    public dialog: MatDialog,
    private googleMapsService: GoogleMapsService,
    private createRouteHelper: CreateRouteHelper,
    private router: Router
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = ITEMS_PER_PAGE;
    this.navigationSubscription = this.router.events.subscribe((routerEvent: Event) => {
     if (routerEvent instanceof NavigationEnd) {
       this.initializeRoutesInventory();
     }
   });
   this.isLoading = true;
  }

  ngOnInit() {
    this.getRoutesInventory();
    this.updateSubscription = this.appEventsService.subscribe('updateRouteInventory', () => {
      this.getRoutesInventory()
    })

    this.googleMapsService.loadGoogleMaps();
  }

  initializeRoutesInventory() {
   this.getRoutesInventory();
  }

  getRoutesInventory = () => {
    this.isLoading = true
    this.routeService.getRoutes(this.pageSize, this.pageNo, this.sort).subscribe(routesData => {
      const { routes, pageMeta } = routesData;
      this.routes = this.renameRouteBatches(routes);
      this.totalItems = pageMeta.totalResults;
      this.headerService.updateBadgeSize(this.totalItems);
      this.isLoading = false;
    });
  };

  renameRouteBatches(routes) {
    const renameBatchesObject = new RenameRouteBatch(routes, this.lastRoute);
    const renamedBatches = renameBatchesObject.renameRouteBatches();
    this.lastRoute = renamedBatches[renamedBatches.length - 1];
    return renamedBatches;
  }

  async copyRoute(route: any) {
    try {
      const { destination } = route;
      const coordinates = await this.googleMapsService
        .getLocationCoordinatesFromAddress(destination);
      const data = this.refactoryRouteObject(route, coordinates);
      return this.sendRequestToServer(data);
    } catch (error) {
      this.createRouteHelper.notifyUser(['Location not found']);
    }
  }

  showCopyConfirmModal(route: any) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'confirm-modal-panel-class',
      data: {
        confirmText: 'Yes',
        displayText: 'copy this route'
      }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
      this.copyRoute(route);
    });
  }

  refactoryRouteObject(routeObject, coordinates) {
    const { destination, capacity, name, regNumber, takeOff } = routeObject;
    const newRouteObject = {
      routeName: name,
      capacity,
      vehicle: regNumber,
      takeOffTime: takeOff,
      destination: {
        address: destination,
        coordinates
      }
    }
    return newRouteObject;
  }

  async sendRequestToServer(data) {
    try {
      const { data: { name } } = await this.routeService.createRoute(data, this.duplicate);
      this.createRouteHelper.notifyUser([`Successfully duplicated ${name.toLowerCase()} route`], 'success');
      this.router.navigate(['/admin/routes/inventory']);
    } catch (error) {
      this.createRouteHelper.notifyUser([error.error.message || 'An error occurred.']);
    }
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
      }, () => this.alert.error('Something went wrong! try again'))
  }

  showDeleteModal(routeBatchId: number, ind: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'logout-modal-panel-class',
      data: {
        confirmText: 'Yes',
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
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
