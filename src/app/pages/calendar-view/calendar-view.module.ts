import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarViewPageRoutingModule } from './calendar-view-routing.module';

import { CalendarViewPage } from './calendar-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarViewPageRoutingModule
  ],
  declarations: [CalendarViewPage]
})
export class CalendarViewPageModule {}
