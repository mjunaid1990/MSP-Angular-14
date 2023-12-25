import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingPageRoutingModule } from './marketing-routing.module';

import { MarketingPage } from './marketing.page';


import { NgxPaginationModule } from 'ngx-pagination';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { IonicSelectableModule } from 'ionic-selectable';

import { SharedModule } from 'src/app/shared/shared.module';

import { MyxmlComponent } from './myxml/myxml.component';

import { MyWebsiteComponent } from './my-website/my-website.component';

import { MyFlyerComponent } from './my-flyer/my-flyer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MarketingPageRoutingModule,
    NgxPaginationModule,
    CustomDirectivesModule,
    IonicSelectableModule,
    SharedModule
    
  ],
  declarations: [MarketingPage, MyxmlComponent, MyWebsiteComponent, MyFlyerComponent]
})
export class MarketingPageModule {}
