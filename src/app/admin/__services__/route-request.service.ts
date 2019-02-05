import { Injectable, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subscription, Observable, of} from 'rxjs';
import {RouteRequest} from '../../shared/models/route-request.model';
import {environment} from '../../../environments/environment';
import { Toastr, TOASTR_TOKEN } from 'src/app/shared/toastr.service';
import {retry} from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';
import { catchError } from 'rxjs/operators';
import { IRouteApprovalDeclineInfo } from '../../shared/models/route-approve-decline-info.model';
import { MatDialogRef } from '@angular/material';
import { RouteApproveDeclineModalComponent } from '../routes/route-approve-decline-modal/route-approve-decline-modal.component';

@Injectable({
  providedIn: 'root'
})
export class RouteRequestService {

  static activeRouteRequest: RouteRequest = new RouteRequest();
  static activeRouteIndex = 0;
  static approvalDeclineDialog: MatDialogRef<RouteApproveDeclineModalComponent>;
  routesUrl = `${environment.tembeaBackEndUrl}/api/v1/routes`;

  private routesRequestSubject: BehaviorSubject<RouteRequest[]> = new BehaviorSubject([]);
  routesRequests = this.routesRequestSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(TOASTR_TOKEN) public toastr: Toastr
  ) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.toastr.error('Something did not work right there.');
      RouteRequestService.approvalDeclineDialog.close();
      return of(result as T);
    };
  }

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

  declineRequest(routeRequestId, comment, email): void {
    this.http.put(`${this.routesUrl}/requests/status/${routeRequestId}`, {
      newOpsStatus: 'decline',
      comment: comment,
      reviewerEmail: email,
      teamUrl: environment.teamUrl,
    })
    .pipe(catchError(this.handleError<IRouteApprovalDeclineInfo>('declineRequest')))
    .subscribe(this.handleDeclineResponse);
  }

  handleDeclineResponse = (data) => {
    if (data.success) {
      let routesRequests;
      this.routesRequestSubject.subscribe(currentValues => {
        routesRequests = currentValues.filter(route => route.id !== data.data.id);
      });
      this.routesRequestSubject.next(routesRequests);
      RouteRequestService.activeRouteIndex = 0;
      RouteRequestService.activeRouteRequest = routesRequests[0];
      RouteRequestService.approvalDeclineDialog.close();
      this.toastr.success('Route request declined!');
      return;
    }

    RouteRequestService.approvalDeclineDialog.close();
    this.toastr.error('Could not decline request');
  }
}
