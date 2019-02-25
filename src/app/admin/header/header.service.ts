import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppHeaderService {

  private header: Subject<any> = new Subject<any>();

  constructor() {
  }

  get update(): Subject<any> {
    return this.header;
  }

  updateHeaderTitle(headerTitle: string) {
    this.header.next({ headerTitle });
  }

  updateBadgeSize(badgeSize: number) {
    this.header.next({ badgeSize });
  }
}
