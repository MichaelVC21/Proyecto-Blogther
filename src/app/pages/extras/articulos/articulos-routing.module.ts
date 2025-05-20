import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticulosPage } from './articulos.page';

const routes: Routes = [
  {
    path: '',
    component: ArticulosPage
  },
  {
    path: 'arti',
    loadChildren: () => import('../arti/arti.module').then( m => m.ArtiPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosPageRoutingModule {}
