import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fellow-card',
  templateUrl: './fellow-card.component.html',
  styleUrls: ['./fellow-card.component.scss']
})
export class FellowCardComponent implements OnInit {
  constructor() {}

  @Input() name: string;
  @Input() image: string;
  @Input() partner: string;
  @Input() tripsTaken: string;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() showRemoveIcon: boolean;

  ngOnInit() {}
}
