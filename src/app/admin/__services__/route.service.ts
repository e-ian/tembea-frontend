import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteInventoryModel } from 'src/app/shared/models/route-inventory.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  routesUrl = `${environment.tembeaBackEndUrl}/api/v1/routes`;
  teamUrl = environment.teamUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: { teamUrl: environment.teamUrl }
};

  constructor(
    private http: HttpClient,
  ) { }

  getRoutes(size: number, page: number, sort: string): Observable<RouteInventoryModel> {
    return this.http.get<any>(`${this.routesUrl}?sort=${sort}&size=${size}&page=${page}`).map(routes => {
      return new RouteInventoryModel().deserialize(routes.data);
    });
  }

  changeRouteStatus(id: number, data: Object): Observable<any> {
    return this.http.put(`${this.routesUrl}/${id}`, { ...data, teamUrl: this.teamUrl })
  }

  deleteRouteBatch(id: number) {
    return this.http.delete(`${environment.tembeaBackEndUrl}/api/v1/routes/${id}`, this.httpOptions)
  }

  createRoute(data): any {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http
      .post(this.routesUrl, data, options)
      .toPromise();
  }
}
