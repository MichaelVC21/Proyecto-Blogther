import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambContraPageRoutingModule } from './camb-contra-routing.module';

import { CambContraPage } from './camb-contra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CambContraPageRoutingModule
  ],
  declarations: [CambContraPage]
})
export class CambContraPageModule {}
