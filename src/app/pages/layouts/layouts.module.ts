import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayoutsPageRoutingModule } from './layouts-routing.module';

import { LayoutsPage } from './layouts.page';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutsPageRoutingModule,
    SharedModule
  ],
  declarations: [LayoutsPage]
})
export class LayoutsPageModule {}
