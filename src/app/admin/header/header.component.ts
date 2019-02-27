import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { IUser } from '../../shared/models/user.model';
import { AppHeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public headerTitle: string;
  public badgeSize = 0;
  user: IUser;
  updateHeaderSubscription: Subscription;

  constructor(
    private navItem: NavMenuService,
    private dialog: MatDialog,
    private auth: AuthService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appHeaderService: AppHeaderService
  ) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    this.getHeaderTitleFromRouteData();

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.getHeaderTitleFromRouteData();
      }
    });

    this.updateHeaderSubscription = this.appHeaderService.update.subscribe(({headerTitle, badgeSize}) => {
      if (headerTitle) {
        this.headerTitle = headerTitle;
      }
      if (badgeSize) {
        this.badgeSize = badgeSize;
      }
    })
  }

  private getHeaderTitleFromRouteData() {
    let route = this.activatedRoute.firstChild;
    if (!route) {
      return;
    }
    while (route.firstChild) {
      route = route.firstChild;
    }
    if (route.outlet === 'primary') {
      route.data.subscribe(value => {
        this.headerTitle = value['title'];
        this.badgeSize = 0;
        this.titleService.setTitle(`Tembea - ${this.headerTitle}`);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.updateHeaderSubscription) {
      this.updateHeaderSubscription.unsubscribe();
    }
  }

  toggleSideNav = () => {
    this.navItem.toggle();
  };

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  showLogoutModal() {
    const firstName = this.auth.getCurrentUser().firstName;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'confirm-modal-panel-class',
      data: {
        displayText: `logout, ${firstName}`,
        confirmText: 'logout'
      }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
      this.logout()
    })
  }
}
