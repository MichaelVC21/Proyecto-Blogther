import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPlantHistorialPageRoutingModule } from './new-plant-historial-routing.module';

import { NewPlantHistorialPage } from './new-plant-historial.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewPlantHistorialPageRoutingModule
  ],
  declarations: [NewPlantHistorialPage]
})
export class NewPlantHistorialPageModule {}
