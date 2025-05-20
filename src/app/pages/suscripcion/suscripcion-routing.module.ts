import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuscripcionPage } from './suscripcion.page';

const routes: Routes = [
  {
    path: '',
    component: SuscripcionPage
  },  {
    path: 'metodo-pago',
    loadChildren: () => import('./metodo-pago/metodo-pago.module').then( m => m.MetodoPagoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuscripcionPageRoutingModule {}
