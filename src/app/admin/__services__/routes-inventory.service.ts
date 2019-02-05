import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteInventoryModel } from 'src/app/shared/models/route-inventory.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class RoutesInventoryService {
  routesUrl: string = `${environment.tembeaBackEndUrl}/api/v1/routes`;
  constructor(private http: HttpClient) {}

  getRoutes(size: number, page: number, sort: string): Observable<RouteInventoryModel> {
    return this.http.get<any>(`${this.routesUrl}?sort=${sort}&size=${size}&page=${page}`).map(routes => {
      return new RouteInventoryModel().deserialize(routes.data);
    });
  }
}
