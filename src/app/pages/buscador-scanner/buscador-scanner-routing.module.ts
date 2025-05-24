import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscadorScannerPage } from './buscador-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: BuscadorScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscadorScannerPageRoutingModule {}
