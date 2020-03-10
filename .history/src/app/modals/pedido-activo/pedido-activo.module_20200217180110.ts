import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoActivoPageRoutingModule } from './pedido-activo-routing.module';

import { PedidoActivoPage } from './pedido-activo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoActivoPageRoutingModule
  ],
  declarations: [PedidoActivoPage]
})
export class PedidoActivoPageModule {}
