import { Injectable, Inject } from '@angular/core';
import { TOASTR_TOKEN, Toastr } from 'src/app/shared/toastr.service';

@Injectable()
export class AlertService {
  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr) { }
  success(msg: string, title?: string) {
    this.toastr.success(msg, title, {
      positionClass: 'toast-top-center'
    });
  }
  info(msg: string, title?: string) {
    this.toastr.info(msg, title, {
      positionClass: 'toast-top-center'
    });
  }
  warning(msg: string, title?: string) {
    this.toastr.warning(msg, title, {
      positionClass: 'toast-top-center'
    });
  }
  error(msg: string, title?: string) {
    this.toastr.error(msg, title, {
      positionClass: 'toast-top-center'
    });
  }
}
