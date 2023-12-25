import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadsPage } from './leads.page';

import { LeadFormComponent } from './lead-form/lead-form.component';

import { LeadViewComponent } from './lead-view/lead-view.component';

const routes: Routes = [
  {
		path: '',
		component: LeadsPage
	},
  	{ 
		path: 'add', 
		component: LeadFormComponent,
		data: {
			title: 'Add New Lead',
		},
	},
	{ 
		path: 'edit/:id',
		component: LeadFormComponent,
		data: {
			title: 'Edit Lead',
		},
	},
	{ 
		path: 'view/:id', 
		component: LeadViewComponent,
		data: {
			title: 'View Lead',
		},
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadsPageRoutingModule {}
