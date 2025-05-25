import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TransferenciaPageRoutingModule } from './transferencia-routing.module';
import { TransferenciaPage } from './transferencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Este es crítico para formGroup
    IonicModule,
    TransferenciaPageRoutingModule
  ],
  declarations: [TransferenciaPage]
})
export class TransferenciaPageModule {}