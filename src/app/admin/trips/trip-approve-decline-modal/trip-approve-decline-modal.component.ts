import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AuthService } from 'src/app/auth/__services__/auth.service';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  templateUrl: 'trip-approve-decline-modal.component.html',
  styleUrls: ['trip-approve-decline-modal.component.scss']
})

export class TripApproveDeclineModalComponent implements OnInit {
  public values: any;
  public loading: boolean;
  public comment: string;
  private account: any;

  constructor(
    public dialogRef: MatDialogRef<TripApproveDeclineModalComponent>,
    public authService: AuthService,
    private tripRequestService: TripRequestService,
    private appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.account = this.authService.getCurrentUser();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirm(values) {
    this.loading = true;
    const { tripId } = this.data;
    this.tripRequestService.confirmRequest(tripId, values)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({ name: 'reInitializeTripRequest' });
      });
  }

  decline(values) {
    this.loading = true;
    const { tripId } = this.data;
    const { comment } = values;
    this.tripRequestService.declineRequest(tripId, comment)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({ name: 'reInitializeTripRequest' });
      });
  }
}
