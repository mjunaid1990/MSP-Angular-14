import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UsersPageRoutingModule,
    NgxPaginationModule,
    CustomDirectivesModule,
    SharedModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}
