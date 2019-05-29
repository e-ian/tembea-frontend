import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { IRouteApprovalDeclineInfo, IRouteDetails } from '../../../shared/models/route-approve-decline-info.model';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  templateUrl: 'route-approve-decline-modal.component.html',
  styleUrls: ['route-approve-decline-modal.component.scss']
})

export class RouteApproveDeclineModalComponent implements OnInit {
  public values: any;
  public comment: string;
  public routeName: string;
  public capacity: number;
  public takeOff: string;
  public providerName: string;
  public loading: boolean;
  private account: any;
  public disableOtherInput = false;
  public selectedProviderOption: any;
  public selectedProvider: any;
  auto = null;
  @ViewChild('approveForm') approveForm: NgForm;

  constructor(
    public dialogRef: MatDialogRef<RouteApproveDeclineModalComponent>,
    public authService: AuthService,
    private routeService: RouteRequestService,
    private appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: IRouteApprovalDeclineInfo,
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
    const { routeName, takeOff, capacity, comment } = values;
    const routeDetails: IRouteDetails = { routeName, takeOff, capacity };
    const { data: { routeRequestId }, account: { email } } = this;
    delete this.selectedProvider.user.slackId;
    this.routeService.approveRouteRequest(routeRequestId, comment, routeDetails, email, this.selectedProvider)
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

  setAuto(event) {
    this.auto = event;
  }

  clearRouteFields(event) {
    const { value } = event.target;
    if (value === '') {
      this.disableOtherInput = false;
      this.approveForm.form.patchValue(this.selectedProviderOption);
    }
  }

  clickedRouteProviders (event) {
    this.selectedProvider = event;
    this.disableOtherInput = true;
    this.approveForm.form.patchValue(event);
  }
}
