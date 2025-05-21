import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarPubliPageRoutingModule } from './agregar-publi-routing.module';

import { AgregarPubliPage } from './agregar-publi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AgregarPubliPageRoutingModule
  ],
  declarations: [AgregarPubliPage]
})
export class AgregarPubliPageModule {}
