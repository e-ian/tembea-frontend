import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DeleteDriverDialogComponent } from 'src/app/admin/drivers/delete-driver-dialog/delete-driver-dialog.component';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss', './driver-card.component.scss']
})

export class DriverCardComponent implements OnInit {

  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Output() refreshWindow = new EventEmitter();
  @Input() id: number;
  @Input() driverName: string;
  @Input() driverPhoneNo: string;
  @Input() driverEmail: string;
  @Input() driverProviderId: number;
  @Input() showMoreIcon: boolean;
  @Input() hidden: boolean;
  confirmDeleteSubscription: any;
  closeDialogSubscription: any;
  dialogRef: MatDialogRef<DeleteDriverDialogComponent>;

  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit() {}

  showMoreOptions(): void {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }

  showDeleteModal(): void {
    this.dialogRef = this.dialog.open(DeleteDriverDialogComponent, {
      panelClass: 'delete-cab-modal',
      data: {
        driver: {
          id: this.id,
          name: this.driverName,
          email: this.driverEmail,
          phoneNo: this.driverPhoneNo,
          providerId: this.driverProviderId
        }
      }
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.refreshWindow.emit();
    });
  }

}
