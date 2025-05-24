import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantDaysPage } from './plant-days.page';

const routes: Routes = [
   { path: '', component: PlantDaysPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantDaysPageRoutingModule {}
