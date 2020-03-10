import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaPage } from './cuenta.page';
import { DireccionesPageModule } from '../direcciones/direcciones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DireccionesPageModule
  ],
  entryComponents: [CuentaPage],
  declarations: [CuentaPage]
})
export class CuentaPageModule {}
