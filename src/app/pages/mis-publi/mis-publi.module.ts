import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisPubliPageRoutingModule } from './mis-publi-routing.module';

import { MisPubliPage } from './mis-publi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MisPubliPageRoutingModule
  ],
  declarations: [MisPubliPage]
})
export class MisPubliPageModule {}
