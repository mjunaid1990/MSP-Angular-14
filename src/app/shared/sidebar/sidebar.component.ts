import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from './../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  is_admin:boolean = false;
  isOpenMenu:boolean = false;
  isMarketMenu:boolean = false;
  isLeadMenu:boolean = false;
  isOpenUserMenu:boolean = false;

  

  constructor(
    public auth: AuthenticationService
  ) {
    if(auth.isAdmin()) {
      this.is_admin = true;
    }
  }

  ngOnInit() {}

  toggleDropdown() {
    this.isOpenMenu = !this.isOpenMenu;
  }

  toggleMarketingDropdown() {
    this.isMarketMenu = !this.isMarketMenu;
  }

  toggleLeadDropdown() {
    this.isLeadMenu = !this.isLeadMenu;
  }

  hideToggle() {
    this.isOpenMenu = false;
    this.isMarketMenu = false;
    this.isLeadMenu = false;
  }

}
