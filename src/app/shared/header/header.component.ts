import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import {AuthenticationService} from './../../services/authentication.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title:string;


  is_admin = false;
  isOpenMenu = false;
  isOpenUserMenu = false;
  search_items:any = [];
 

  constructor(
    public auth: AuthenticationService,
    private common: CommonService,
    private router: Router
  ) {
    if(auth.isAdmin()) {
      this.is_admin = true;
    }



  }

  @ViewChild("insideElement") insideElement;
  @HostListener('document:click', ['$event.target'])

  public onClick(targetElement) {
    const clickedInside = this.insideElement?this.insideElement.nativeElement.contains(targetElement):'';
    if (!clickedInside) {
      this.search_items = [];
    }
  }

  ngOnInit() {}


  toggleUserMenu() {
    this.isOpenUserMenu = !this.isOpenUserMenu;
  }

  hideUserToggle() {
    this.isOpenUserMenu = false;
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.common.dashboard_search(query).subscribe({
      next: data => {
        this.search_items = data;
      },
      error: err => {
        
      }
    });
  }

  redirectTo(id, type) {
    if(type == 'MSP ID') {
      this.router.navigate(['/app/listings/view/'+id]);
    }else {
      this.router.navigate(['/app/leads/view/'+id]);
    }
    
  }

  Logout() {
    this.isOpenUserMenu = false;
    this.auth.logout();
  }

}
