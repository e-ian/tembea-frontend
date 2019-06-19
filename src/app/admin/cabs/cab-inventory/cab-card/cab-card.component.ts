import { createDialogOptions } from './../../../../utils/helpers';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteCabModalComponent } from 'src/app/admin/cabs/cab-inventory/delete-cab-dialog/delete-cab-dialog.component';
import { AddCabsModalComponent } from '../../add-cab-modal/add-cab-modal.component';

@Component({
  selector: 'app-cab-card',
  templateUrl: './cab-card.component.html',
  styleUrls: ['./cab-card.component.scss']
})
export class CabCardComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  @Output() refreshWindow = new EventEmitter();
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() id: number;
  @Input() model: string;
  @Input() regNumber: string;
  @Input() capacity: number;
  @Input() hidden: boolean;
  @Input() showMoreIcon: boolean;

  ngOnInit() {}

  showCabDeleteModal() {
    const dialogRef = this.dialog.open(DeleteCabModalComponent, createDialogOptions({
      cab: {
        id: this.id,
        model: this.model,
        regNumber: this.regNumber,
        capacity: this.capacity
      }
    }, '620px', 'delete-cab-modal'));

    dialogRef.componentInstance.refresh.subscribe(() => {
      this.refreshWindow.emit();
    });
  }

  showCabEditModal() {
    const dialogRef = this.dialog.open(AddCabsModalComponent, createDialogOptions(
      {
        id: this.id,
        model: this.model,
        regNumber: this.regNumber,
        capacity: this.capacity
      }, '620px', 'small-modal-panel-class'));
    dialogRef.afterClosed().subscribe(() => {
      this.hidden = !this.hidden;
    });
  }

  showMoreOptions() {
    this.showOptions.emit();
  }
}
