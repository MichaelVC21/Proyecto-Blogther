import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPlantHistorialPage } from './new-plant-historial.page';

const routes: Routes = [
  {
    path: '',
    component: NewPlantHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPlantHistorialPageRoutingModule {}
