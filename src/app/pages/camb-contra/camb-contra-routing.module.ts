import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambContraPage } from './camb-contra.page';

const routes: Routes = [
  {
    path: '',
    component: CambContraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambContraPageRoutingModule {}
