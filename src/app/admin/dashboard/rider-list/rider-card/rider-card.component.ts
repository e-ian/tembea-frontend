import { Component, OnInit, Input } from '@angular/core';
import {IRider} from '../../../../shared/models/rider.model';

@Component({
  selector: 'app-rider-card',
  templateUrl: './rider-card.component.html',
  styleUrls: ['./rider-card.component.scss']
})
export class RiderCardComponent implements OnInit {
  @Input() rider: IRider;
  constructor() { }

  ngOnInit() {
  }

}
