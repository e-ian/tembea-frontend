import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteRequestService} from '../../__services__/route-request.service';
import {RouteRequest} from '../../../shared/models/route-request.model';
import {Subscription} from 'rxjs';
import {IUser} from '../../../shared/user.model';
import {AuthService} from '../../../auth/__services__/auth.service';

@Component({
  selector: 'app-route-requests',
  templateUrl: './route-requests.component.html',
  styleUrls: ['./route-requests.component.scss']
})
export class RouteRequestsComponent implements OnInit, OnDestroy {

  routesSubscription: Subscription;
  routes: RouteRequest[] = [];
  user: IUser;

  constructor(
    public routeService: RouteRequestService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.routesSubscription = this.routeService.getAllRequests();
    this.routeService.routesRequests.subscribe((val) => {
      this.routes = val;
    });
  }

  ngOnDestroy() {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }

  onClickRouteBox = (index, route: RouteRequest) => {
    RouteRequestService.activeRouteIndex = index;
    RouteRequestService.activeRouteRequest = route;
  };

  isRouteActive(idx: number): Boolean {
    return RouteRequestService.activeRouteIndex === idx;
  }

  getCurrentRoute(): RouteRequest {
    return RouteRequestService.activeRouteRequest;
  }
}
