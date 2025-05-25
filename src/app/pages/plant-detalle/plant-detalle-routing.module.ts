import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantDetallePage } from './plant-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: PlantDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantDetallePageRoutingModule {}
