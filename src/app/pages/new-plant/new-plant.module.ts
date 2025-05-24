import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPlantPageRoutingModule } from './new-plant-routing.module';

import { NewPlantPage } from './new-plant.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewPlantPageRoutingModule
  ],
  declarations: [NewPlantPage]
})
export class NewPlantPageModule {}
