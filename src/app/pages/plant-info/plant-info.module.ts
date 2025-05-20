import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantInfoPageRoutingModule } from './plant-info-routing.module';

import { PlantInfoPage } from './plant-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlantInfoPageRoutingModule
  ],
  declarations: [PlantInfoPage]
})
export class PlantInfoPageModule {}
