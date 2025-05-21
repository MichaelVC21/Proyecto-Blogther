import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPubliPage } from './agregar-publi.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPubliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPubliPageRoutingModule {}
