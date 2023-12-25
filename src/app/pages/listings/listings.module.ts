import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingsPageRoutingModule } from './listings-routing.module';

import { ListingsPage } from './listings.page';

import { IonicSelectableModule } from 'ionic-selectable';

import { ListingformComponent } from './form/listingform/listingform.component';

import { ListingViewComponent } from './listing-view/listing-view.component';

import { EditorModule } from '@tinymce/tinymce-angular';

import { GoogleMapsModule } from '@angular/google-maps';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { NgxPaginationModule } from 'ngx-pagination';

import { CustomDirectivesModule } from 'src/app/custom-directives/custom-directives.module';

import { SortablejsModule } from 'ngx-sortablejs';
import { LightgalleryModule } from 'lightgallery/angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { TitleCasePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ListingsPageRoutingModule,
    IonicSelectableModule,
    EditorModule,
    GoogleMapsModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    CustomDirectivesModule,
    SortablejsModule.forRoot({'animation': 150}),
    LightgalleryModule,
    SharedModule
  ],
  declarations: [ListingsPage, ListingformComponent, ListingViewComponent],
  providers: [TitleCasePipe]
})
export class ListingsPageModule {}
