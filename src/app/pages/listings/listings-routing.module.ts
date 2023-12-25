import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingsPage } from './listings.page';
import { ListingformComponent } from './form/listingform/listingform.component';
import { ListingViewComponent } from './listing-view/listing-view.component';

const routes: Routes = [
	{
		path: '',
		component: ListingsPage
	},
  	{ 
		path: 'add', 
		component: ListingformComponent,
		data: {
			title: 'Add New Listing',
		},
	},
	{ 
		path: 'edit/:id',
		component: ListingformComponent,
		data: {
			title: 'Edit Listing',
		},
	},
	{ 
		path: 'view/:id', 
		component: ListingViewComponent,
		data: {
			title: 'View Listing',
		},
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingsPageRoutingModule {}
