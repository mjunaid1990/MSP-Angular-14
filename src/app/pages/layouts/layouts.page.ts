import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.page.html',
  styleUrls: ['./layouts.page.scss'],
})
export class LayoutsPage implements OnInit {

  event$;
  layoutClass:any = '';

  constructor(private router: Router) {
    let url = router.url;
    this.event$ = this.router.events.subscribe(
          (event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
              this.layoutClass = '';
              if(event.url === '/app') {
                this.layoutClass = 'gradient-style';
              }else if(url === '/app/leads') {
                this.layoutClass = 'transparent-style';
              }else if(url == '/app/leads/view') {
                this.layoutClass = 'gradient-style';
              }else {
                this.layoutClass = 'white-bg-style';
              }
            }
          });
       
    if(url === '/app') {
      this.layoutClass = 'gradient-style';
    }else if(url == '/app/leads') {
      this.layoutClass = 'transparent-style';
    }else if(url == '/app/leads/view') {
      this.layoutClass = 'gradient-style';
    }else {
      this.layoutClass = 'white-bg-style';
    }      

  }

  title = 'Dashboard';

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  ngOnInit() {
  }

  setTitle(title) {
    this.title = title;
  }

}
