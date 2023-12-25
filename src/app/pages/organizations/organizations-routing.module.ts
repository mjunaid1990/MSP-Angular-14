import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationsPage } from './organizations.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsPageRoutingModule {}
