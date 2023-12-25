import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowingsPage } from './showings.page';

const routes: Routes = [
  {
    path: '',
    component: ShowingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowingsPageRoutingModule {}
