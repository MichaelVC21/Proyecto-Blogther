import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreRegisPageRoutingModule } from './pre-regis-routing.module';

import { PreRegisPage } from './pre-regis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreRegisPageRoutingModule
  ],
  declarations: [PreRegisPage]
})
export class PreRegisPageModule {}
