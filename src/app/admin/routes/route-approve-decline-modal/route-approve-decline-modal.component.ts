import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from 'src/app/auth/__services__/auth.service';
import { IRouteApprovalDeclineInfo } from '../../../shared/models/route-approve-decline-info.model';
import { RouteRequestService } from '../../__services__/route-request.service';

@Component({
  templateUrl: 'route-approve-decline-modal.component.html',
  styleUrls: ['route-approve-decline-modal.component.scss']
})
export class RouteApproveDeclineModalComponent implements OnInit {
  public firstName: string;
  public comment: string;
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

  approve(): void {
  }

  decline(values): void {
    this.loading = true;
    this.routeService.declineRequest(this.data.routeRequestId, values.comment, this.authService.getCurrentUser().email);
  }
}
