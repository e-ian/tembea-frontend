import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit {
  startDate = new Date(2013, 0, 1);
  constructor() { }

  ngOnInit() {
  }

}
