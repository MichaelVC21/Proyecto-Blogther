import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisPubliPageRoutingModule } from './mis-publi-routing.module';

import { MisPubliPage } from './mis-publi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisPubliPageRoutingModule
  ],
  declarations: [MisPubliPage]
})
export class MisPubliPageModule {}
