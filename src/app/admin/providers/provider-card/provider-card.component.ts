import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
})
export class ProviderCardComponent implements OnInit {

  @Output() refreshWindow = new EventEmitter();
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() id: number;
  @Input() username: string;
  @Input() name: string;
  @Input() email: string;
  @Input() showMoreIcon: boolean;
  @Input() hidden: boolean;

  ngOnInit() { }

  showMoreOptions() {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }
}
