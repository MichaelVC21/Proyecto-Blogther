import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalleryViewPage } from './gallery-view.page';

const routes: Routes = [
  {
    path: '',
    component: GalleryViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleryViewPageRoutingModule {}
