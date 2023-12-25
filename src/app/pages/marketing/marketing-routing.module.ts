import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingPage } from './marketing.page';

import { MyxmlComponent } from './myxml/myxml.component';

import { MyWebsiteComponent } from './my-website/my-website.component';

import { MyFlyerComponent } from './my-flyer/my-flyer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/marketing/myxml',
    pathMatch: 'full'
  },
  {
    path: 'myxml',
    component: MyxmlComponent
  },
  {
    path: 'my-website',
    component: MyWebsiteComponent
  },
  {
    path: 'my-flyer',
    component: MyFlyerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingPageRoutingModule {}
