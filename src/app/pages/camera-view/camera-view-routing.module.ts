import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CameraViewPage } from './camera-view.page';

const routes: Routes = [
  {
    path: '',
    component: CameraViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CameraViewPageRoutingModule {}
