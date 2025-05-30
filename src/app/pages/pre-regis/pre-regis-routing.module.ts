import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreRegisPage } from './pre-regis.page';

const routes: Routes = [
  {
    path: '',
    component: PreRegisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreRegisPageRoutingModule {}
