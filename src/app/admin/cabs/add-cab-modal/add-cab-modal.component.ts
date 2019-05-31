import { Component, Output, EventEmitter, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CabModel } from 'src/app/shared/models/cab-inventory.model';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';


@Component({
    templateUrl: './add-cab-modal.component.html',
    styleUrls: ['./add-cab-modal.component.scss']
})

export class AddCabsModalComponent {
    loading: boolean;
    cabData: CabModel;
    providerId: number;

    @Output() executeFunction = new EventEmitter();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef <AddCabsModalComponent>,
        public cabService: CabsInventoryService,
        public alert: AlertService,
        private appEventService: AppEventService
    ) {
        this.cabData = new CabModel('', '', '', null);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    addCab(): void {
        this.loading = true;
        this.cabData.providerId = this.data.providerId;
        this.cabService.addCab(this.cabData)
        .subscribe(
            (responseData) => {
                if (responseData.success) {
                    this.alert.success(responseData.message);
                    this.appEventService.broadcast({ name: 'newCab' });
                    this.loading = false;
                    this.dialogRef.close();
                }
            },
            (error) => {
                const errorMessage = (error && error.status  === 409) ?
                'A cab with the registration or phone number already exists'
                : 'Something went wrong, please try again';
                this.alert.error(errorMessage)
                this.loading = false;
            }
        )
    }
}
