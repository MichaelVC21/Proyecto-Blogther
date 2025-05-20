import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryViewPageRoutingModule } from './gallery-view-routing.module';

import { GalleryViewPage } from './gallery-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryViewPageRoutingModule
  ],
  declarations: [GalleryViewPage]
})
export class GalleryViewPageModule {}
