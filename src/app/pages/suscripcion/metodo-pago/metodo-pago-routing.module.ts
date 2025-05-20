import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodoPagoPage } from './metodo-pago.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodoPagoPageRoutingModule {}
