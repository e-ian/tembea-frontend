import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderModalComponent } from '../provider-modal/provider-modal.component';

@Component({
  selector: 'app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
})
export class ProviderCardComponent implements OnInit {
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() id: number;
  @Input() username: string;
  @Input() name: string;
  @Input() email: string;
  @Input() showMoreIcon: boolean;
  @Input() hidden: boolean;
  constructor(public dialog: MatDialog) {

  }
  ngOnInit() { }
  openEditModal() {
    const dialogRef = this.dialog.open(ProviderModalComponent, {
      width: '620px', panelClass: 'small-modal-panel-class',
      data: { name: this.name, email: this.email, id: this.id } });
    dialogRef.afterClosed().subscribe(() => {
      this.hidden = !this.hidden;
    });
  }
  showMoreOptions() {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }
}
