import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPlantEntryPageRoutingModule } from './edit-plant-entry-routing.module';

import { EditPlantEntryPage } from './edit-plant-entry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPlantEntryPageRoutingModule
  ],
  declarations: [EditPlantEntryPage]
})
export class EditPlantEntryPageModule {}
