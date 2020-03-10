import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoActivoPage } from './pedido-activo.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [PedidoActivoPage],
  entryComponents: [PedidoActivoPage]
})
export class PedidoActivoPageModule {}
