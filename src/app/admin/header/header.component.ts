import { Component, OnInit } from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(
        private navItem: NavMenuService
    ) { }
    ngOnInit() { }

    toggleSideNav = () => {
        this.navItem.toggle();
    };
}

