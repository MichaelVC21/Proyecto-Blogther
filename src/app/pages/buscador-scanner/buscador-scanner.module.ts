import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuscadorScannerPageRoutingModule } from './buscador-scanner-routing.module';

import { BuscadorScannerPage } from './buscador-scanner.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BuscadorScannerPageRoutingModule
  ],
  declarations: [BuscadorScannerPage]
})
export class BuscadorScannerPageModule {}
