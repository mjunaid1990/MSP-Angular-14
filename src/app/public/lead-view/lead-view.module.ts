import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadViewPageRoutingModule } from './lead-view-routing.module';

import { LeadViewPage } from './lead-view.page';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LeadViewPageRoutingModule,
    CustomDirectivesModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [LeadViewPage]
})
export class LeadViewPageModule {}
