import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subscription} from 'rxjs';
import {RouteRequest} from '../../shared/models/route-request.model';
import {environment} from '../../../environments/environment';
import {retry} from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class RouteRequestService {

  static activeRouteRequest: RouteRequest = new RouteRequest();
  static activeRouteIndex = 0;
  routesUrl = `${environment.tembeaBackEndUrl}/api/v1/routes`;

  private routesRequestSubject: BehaviorSubject<RouteRequest[]> = new BehaviorSubject([]);
  routesRequests = this.routesRequestSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllRequests(): Subscription {
    return this.http.get<{ routes: RouteRequest[] }>(`${this.routesUrl}/requests`)
      .pipe(
        retry(3),
      ).map(this.handleRoutesRequests)
      .subscribe();
  }

  private handleRoutesRequests = (routesList: { routes: Array<any> }): RouteRequest[] => {
    const routesRequests = routesList.routes.map(value => new RouteRequest().deserialize(value));
    RouteRequestService.activeRouteRequest = routesRequests[RouteRequestService.activeRouteIndex] || new RouteRequest();

    this.routesRequestSubject.next(routesRequests);
    return routesRequests;
  };
}
