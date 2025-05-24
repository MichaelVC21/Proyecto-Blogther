import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlantDaysPageRoutingModule } from './plant-days-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PlantDaysPage } from './plant-days.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedModule,
    PlantDaysPageRoutingModule
  ],
  declarations: [PlantDaysPage]
})
export class PlantDaysPageModule {}
