import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  ,  ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioPageRoutingModule } from './calendario-routing.module';

import { CalendarioPage } from './calendario.page';

@NgModule({
  imports: [
    ReactiveFormsModule,   // <-- ESTE ES EL CRÍTICO
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioPageRoutingModule
  ],
  declarations: [CalendarioPage]
})
export class CalendarioPageModule {}
