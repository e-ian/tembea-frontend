import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import {RouteRequestService} from '../../__services__/route-request.service';
import {RouteRequest} from '../../../shared/models/route-request.model';
import {Subscription} from 'rxjs';
import { IUser } from 'src/app/shared/models/user.model';
import {AuthService} from '../../../auth/__services__/auth.service';
import { RouteApproveDeclineModalComponent } from '../route-approve-decline-modal/route-approve-decline-modal.component';
import { IRouteApprovalDeclineInfo } from 'src/app/shared/models/route-approve-decline-info.model';
import { AisService } from '../../__services__/ais.service';
import { AISData } from 'src/app/shared/models/ais.model';

@Component({
  selector: 'app-route-requests',
  templateUrl: './route-requests.component.html',
  styleUrls: ['./route-requests.component.scss']
})
export class RouteRequestsComponent implements OnInit, OnDestroy {
  routesSubscription: Subscription;
  routes: RouteRequest[] = [];
  user: IUser;
  requesterData: AISData;

  constructor(
    public routeService: RouteRequestService,
    public dialog: MatDialog,
    private authService: AuthService,
    private userData: AisService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    let routeRequest: RouteRequest
    this.routesSubscription = this.routeService.getAllRequests();
    this.routeService.routesRequests.subscribe((val) => {
      this.routes = val;
      routeRequest = this.routes[0];
      if (routeRequest) {
        this.getRequesterData(routeRequest.engagement.fellow.email);
      }
    });
  }

  ngOnDestroy() {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }

  onClickRouteBox = (index, route: RouteRequest) => {
    RouteRequestService.activeRouteIndex = index;
    RouteRequestService.activeRouteRequest = route;
    this.getRequesterData(route.engagement.fellow.email);
  };

  isRouteActive(idx: number): Boolean {
    return RouteRequestService.activeRouteIndex === idx;
  }

  getCurrentRoute(): RouteRequest {
    return RouteRequestService.activeRouteRequest;
  }

  decline(): void {
    const routesRequests = this.getCurrentRoute();
    RouteRequestService.approvalDeclineDialog = this.dialog.open(RouteApproveDeclineModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'route-decline-modal-panel-class',
      data: <IRouteApprovalDeclineInfo>{
        status: 1,
        requesterFirstName: routesRequests.engagement.fellow.name,
        routeRequestId: routesRequests.id
      }
    });
  }

  approve(): void {
    const routesRequests = this.getCurrentRoute();
    RouteRequestService.approvalDeclineDialog = this.dialog.open(RouteApproveDeclineModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'route-decline-modal-panel-class',
      data: <IRouteApprovalDeclineInfo>{
        status: 0,
        requesterFirstName: routesRequests.engagement.fellow.name,
        routeRequestId: routesRequests.id
      }
    });
  }

  getRequesterData(email: string) {
    this.userData.getResponse(email)
    .subscribe(data => {
      this.requesterData = data;
    }
  )}
}
