import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripRequestService } from '../../__services__/trip-request.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  selector: 'app-update-provider-trip',
  templateUrl: './update-trip-provider-modal.component.html',
  styleUrls: [
    './update-trip-provider-modal.component.scss'
  ]
})
export class UpdateTripProviderModalComponent {
  tripProviderDetails = this.data.tripProviderDetails;
  submitBtnSpinnerLoading = false;

  providerUpdateForm = new FormGroup({
    provider: new FormControl(this.tripProviderDetails.providers[0], Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateTripProviderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tripRequestService: TripRequestService
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }

  changeSubmitSpinnerState(state: boolean) {
    this.submitBtnSpinnerLoading = state;
  }

  updateTripProvider() {
    this.changeSubmitSpinnerState(true);
    const { tripProviderDetails: { activeTripId } } = this.data;
    const { provider: { id: providerId } } = this.providerUpdateForm.value;
    this.tripRequestService.confirmRequest(activeTripId, {
      providerId, comment: 'Updating trip\'s provider'
    })
    .subscribe(() => {
      this.dialogRef.close();
    });
  }
}
