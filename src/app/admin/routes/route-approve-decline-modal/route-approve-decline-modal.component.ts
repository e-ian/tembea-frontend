import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from 'src/app/auth/__services__/auth.service';
import { IRouteApprovalDeclineInfo, IRouteDetails  } from '../../../shared/models/route-approve-decline-info.model';
import { RouteRequestService } from '../../__services__/route-request.service';

@Component({
  templateUrl: 'route-approve-decline-modal.component.html',
  styleUrls: ['route-approve-decline-modal.component.scss']
})
export class RouteApproveDeclineModalComponent implements OnInit {
  public firstName: string;
  public comment: string;
  public routeName: string;
  public capacity: number;
  public takeOff: string;
  public cabRegNumber: string;
  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<RouteApproveDeclineModalComponent>,
    private authService: AuthService,
    private routeService: RouteRequestService,
    @Inject(MAT_DIALOG_DATA) public data: IRouteApprovalDeclineInfo
  ) { }

  ngOnInit() {
    this.loading = false;
    this.firstName = this.authService.getCurrentUser().firstName;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  approve(values): void {
    this.loading = true;
    const routeDetails: IRouteDetails = {};

    routeDetails['routeName'] = values.routeName;
    routeDetails['takeOff'] = values.takeOff;
    routeDetails['cabRegNumber'] = values.cabRegNumber;
    routeDetails['capacity'] = values.capacity;

    this.routeService.approveRequest(
      this.data.routeRequestId,
      values.comment,
      routeDetails,
      this.authService.getCurrentUser().email
    );
  }

  decline(values): void {
    this.loading = true;
    this.routeService.declineRequest(this.data.routeRequestId, values.comment, this.authService.getCurrentUser().email);
  }
}
