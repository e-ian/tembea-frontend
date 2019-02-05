import {Component, OnInit} from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';
import { MatDialog } from '@angular/material';
import { LogoutModalComponent } from '../../auth/logout-modal/logout-modal.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import {Router, NavigationEnd, ActivatedRoute, RouterEvent} from '@angular/router';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {RouteRequestService} from '../__services__/route-request.service';
import {RouteRequest} from '../../shared/models/route-request.model';
import {IUser} from '../../shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public headerTitle: string;
  user: IUser;
  routes: RouteRequest[] = [];
  isCurrentRouteForRouteRequests = false;

  constructor(
    private navItem: NavMenuService,
    private dialog: MatDialog,
    private auth: AuthService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteRequestService
  ) { }

  ngOnInit() {
    this.routeService.routesRequests.subscribe((val) => {
      this.routes = val;
    });
    this.user = this.auth.getCurrentUser();
    this.isCurrentRouteForRouteRequests = this.router.url.includes('/routes/requests');

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        let route = this.activatedRoute.firstChild;
        this.isCurrentRouteForRouteRequests = this.router.url.includes('/routes/requests');

        while (route.firstChild) {
          route = route.firstChild;
        }
        if (route.outlet === 'primary') {
          route.data.subscribe(value => {
            this.headerTitle = value['title'];
            this.titleService.setTitle(`Tembea - ${this.headerTitle}`);
          });
        }
      }
    });
  }

  toggleSideNav = () => {
    this.navItem.toggle();
  };

  logout() {
    this.dialog.open(LogoutModalComponent, {
      width: '592px',
      backdropClass: 'logout-modal-backdrop',
      panelClass: 'logout-modal-panel-class'
    });
  }
}
