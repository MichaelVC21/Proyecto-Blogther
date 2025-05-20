import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtiPageRoutingModule } from './arti-routing.module';

import { ArtiPage } from './arti.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ArtiPageRoutingModule
  ],
  declarations: [ArtiPage]
})
export class ArtiPageModule {}
