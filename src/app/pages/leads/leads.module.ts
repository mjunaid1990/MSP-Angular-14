import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadsPageRoutingModule } from './leads-routing.module';

import { LeadsPage } from './leads.page';

import { CalendarModule } from 'ion2-calendar';

import { NgxPaginationModule } from 'ngx-pagination';

import { IonicSelectableModule } from 'ionic-selectable';

import { TagInputModule } from 'ngx-chips';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { LeadFormComponent } from './lead-form/lead-form.component';

import { LeadViewComponent } from './lead-view/lead-view.component';

import { EditorModule } from '@tinymce/tinymce-angular';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadsPageRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxPaginationModule,
    IonicSelectableModule,
    TagInputModule,
    DragDropModule,
    CustomDirectivesModule,
    EditorModule,
    SharedModule

  ],
  declarations: [LeadsPage, LeadFormComponent, LeadViewComponent]
})
export class LeadsPageModule {}
