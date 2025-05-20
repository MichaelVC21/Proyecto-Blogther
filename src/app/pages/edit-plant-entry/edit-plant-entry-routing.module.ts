import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPlantEntryPage } from './edit-plant-entry.page';

const routes: Routes = [
  {
    path: '',
    component: EditPlantEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPlantEntryPageRoutingModule {}
