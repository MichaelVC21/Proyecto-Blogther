import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PubliPageRoutingModule } from './publi-routing.module';

import { PubliPage } from './publi.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PubliPageRoutingModule
  ],
  declarations: [PubliPage]
})
export class PubliPageModule {}
