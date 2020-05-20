import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormasPagoPageRoutingModule } from './formas-pago-routing.module';

import { FormasPagoPage } from './formas-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormasPagoPageRoutingModule
  ],
  declarations: [FormasPagoPage]
})
export class FormasPagoPageModule {}
