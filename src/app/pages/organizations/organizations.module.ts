import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizationsPageRoutingModule } from './organizations-routing.module';

import { OrganizationsPage } from './organizations.page';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { IonicSelectableModule } from 'ionic-selectable';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizationsPageRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    IonicSelectableModule,
    CustomDirectivesModule,
    SharedModule
  ],
  declarations: [OrganizationsPage]
})
export class OrganizationsPageModule {}
