import { IDriverModel } from './../../shared/models/driver.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import { IResponseModel} from '../../shared/models/driver.model';
import { DriverInventoryModel } from '../../shared/models/base.model';
import { BaseInventoryService } from './base-inventory-service';

@Injectable({
  providedIn: 'root',
})

export class DriversInventoryService extends BaseInventoryService<IDriverModel, DriverInventoryModel> {
  constructor(http: HttpClient) {
    super(`${environment.tembeaBackEndUrl}/api/v1/drivers`, http);
  }
}
