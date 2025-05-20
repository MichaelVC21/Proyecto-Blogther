import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicacionesPage } from './publicaciones.page';

const routes: Routes = [
  {
    path: '',
    component: PublicacionesPage
  },
  {
    path: 'publi',
    loadChildren: () => import('../publi/publi.module').then( m => m.PubliPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicacionesPageRoutingModule {}
