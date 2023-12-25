import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    pathMatch: 'full'
  },
  
  {
    path: 'app',
    loadChildren: () => import('./pages/layouts/layouts.module').then( m => m.LayoutsPageModule),
    canLoad: [AuthGuard]
  },
  // {
  //   path: 'users',
  //   loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
  //   canLoad: [AuthGuard]
  // },
  // {
  //   path: 'organizations',
  //   loadChildren: () => import('./pages/organizations/organizations.module').then( m => m.OrganizationsPageModule),
  //   canLoad: [AuthGuard]
  // },
  
  {
    path: 'lead/view/:id',
    loadChildren: () => import('./public/lead-view/lead-view.module').then( m => m.LeadViewPageModule),
    pathMatch: 'full'
  }
  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
