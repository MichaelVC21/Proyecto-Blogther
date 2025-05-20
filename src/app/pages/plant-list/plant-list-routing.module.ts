import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantListPage } from './plant-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlantListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantListPageRoutingModule {}
