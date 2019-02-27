import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AuthService } from 'src/app/auth/__services__/auth.service';
import { IRouteApprovalDeclineInfo, IRouteDetails } from '../../../shared/models/route-approve-decline-info.model';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  templateUrl: 'route-approve-decline-modal.component.html',
  styleUrls: ['route-approve-decline-modal.component.scss']
})
export class RouteApproveDeclineModalComponent implements OnInit {
  public comment: string;
  public routeName: string;
  public capacity: number;
  public takeOff: string;
  public cabRegNumber: string;
  public loading: boolean;
  private account: any;

  constructor(
    public dialogRef: MatDialogRef<RouteApproveDeclineModalComponent>,
    public authService: AuthService,
    private routeService: RouteRequestService,
    private appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: IRouteApprovalDeclineInfo
  ) {
  }

  ngOnInit() {
    this.loading = false;
    this.account = this.authService.getCurrentUser();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  approve(values): void {
    this.loading = true;
    const { routeName, takeOff, cabRegNumber, capacity, comment } = values;
    const routeDetails: IRouteDetails = { routeName, takeOff, cabRegNumber, capacity };
    const { data: { routeRequestId }, account: { email } } = this;

    this.routeService.approveRequest(routeRequestId, comment, routeDetails, email)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({ name: 'updateRouteRequestStatus' });
      });
  }

  decline(values): void {
    this.loading = true;
    const { data: { routeRequestId }, account: { email } } = this;
    const { comment } = values;
    this.routeService.declineRequest(routeRequestId, comment, email)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({ name: 'updateRouteRequestStatus' });
      });
  }
}
