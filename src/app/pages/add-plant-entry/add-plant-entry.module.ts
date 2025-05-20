import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPlantEntryPageRoutingModule } from './add-plant-entry-routing.module';

import { AddPlantEntryPage } from './add-plant-entry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPlantEntryPageRoutingModule
  ],
  declarations: [AddPlantEntryPage]
})
export class AddPlantEntryPageModule {}
