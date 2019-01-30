import { Component, OnInit } from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';
import { MatDialog } from '@angular/material';
import { LogoutModalComponent } from '../../auth/logout-modal/logout-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private navItem: NavMenuService,
    private dialog: MatDialog
  ) { }
  ngOnInit() { }

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

