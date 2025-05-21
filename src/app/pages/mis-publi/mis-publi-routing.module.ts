import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisPubliPage } from './mis-publi.page';

const routes: Routes = [
  {
    path: '',
    component: MisPubliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisPubliPageRoutingModule {}
