import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutsPage } from './layouts.page';

const routes: Routes = [
  {
    path: '',
    component: LayoutsPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule),
        pathMatch: 'full'
      },
      {
        path: 'showings',
        loadChildren: () => import('../showings/showings.module').then( m => m.ShowingsPageModule),
        pathMatch: 'full'
      },
      {
        path: 'leads',
        loadChildren: () => import('../leads/leads.module').then( m => m.LeadsPageModule)
      },
      {
        path: 'listings',
        loadChildren: () => import('../listings/listings.module').then( m => m.ListingsPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then( m => m.UsersPageModule)
      },
      {
        path: 'organizations',
        loadChildren: () => import('../organizations/organizations.module').then( m => m.OrganizationsPageModule)
      },
      {
        path: 'marketing',
        loadChildren: () => import('../marketing/marketing.module').then( m => m.MarketingPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsPageRoutingModule {}
