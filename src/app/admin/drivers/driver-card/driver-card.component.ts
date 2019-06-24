import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss', './driver-card.component.scss']
})

export class DriverCardComponent implements OnInit {

  @Output() refreshWindow = new EventEmitter();
  @Input() id: number;
  @Input() driverName: string;
  @Input() driverPhoneNo: string;
  @Input() driverEmail: string;

  ngOnInit() {}

}
