import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoActivoPage } from './pedido-activo.page';
// import { StarRatingModule } from 'ionic4-star-rating';
import { CalificarPageModule } from '../calificar/calificar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // StarRatingModule,
    CalificarPageModule,
  ],
  declarations: [PedidoActivoPage],
  entryComponents: [PedidoActivoPage]
})
export class PedidoActivoPageModule {}
