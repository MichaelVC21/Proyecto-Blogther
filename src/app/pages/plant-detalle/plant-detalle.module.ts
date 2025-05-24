import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  

import { IonicModule } from '@ionic/angular';

import { PlantDetallePageRoutingModule } from './plant-detalle-routing.module';

import { PlantDetallePage } from './plant-detalle.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,SharedModule,
    PlantDetallePageRoutingModule
  ],
  declarations: [PlantDetallePage]
})
export class PlantDetallePageModule {}
