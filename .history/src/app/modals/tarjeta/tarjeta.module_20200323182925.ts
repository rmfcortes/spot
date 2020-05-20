import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarjetaPage } from './tarjeta.page';
import { AyudaPageModule } from '../ayuda/ayuda.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyudaPageModule,
  ],
  declarations: [TarjetaPage],
  entryComponents: [TarjetaPage]
})
export class TarjetaPageModule {}
