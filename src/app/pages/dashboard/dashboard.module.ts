import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

import { SharedModule } from '../../shared/shared.module';

import { CalendarModule } from 'ion2-calendar';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CircleProgressBarComponent } from 'src/app/components/circle-progress-bar/circle-progress-bar.component';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedModule,
    CalendarModule,
    NgApexchartsModule,
    CustomDirectivesModule

  ],
  declarations: [DashboardPage, CircleProgressBarComponent]
})
export class DashboardPageModule {}
