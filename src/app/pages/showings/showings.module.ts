import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowingsPageRoutingModule } from './showings-routing.module';

import { ShowingsPage } from './showings.page';

import { CalendarModule } from 'ion2-calendar';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShowingsPageRoutingModule,
    CalendarModule,
    NgxPaginationModule,
    IonicSelectableModule,
    CustomDirectivesModule,
    SharedModule
  ],
  declarations: [ShowingsPage]
})
export class ShowingsPageModule {}
