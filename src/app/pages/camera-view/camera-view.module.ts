import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CameraViewPageRoutingModule } from './camera-view-routing.module';

import { CameraViewPage } from './camera-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CameraViewPageRoutingModule
  ],
  declarations: [CameraViewPage]
})
export class CameraViewPageModule {}
