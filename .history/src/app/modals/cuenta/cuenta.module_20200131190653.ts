import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentaPage } from './cuenta.page';

import { AgmCoreModule } from '@agm/core';
import { DireccionesPageModule } from '../direcciones/direcciones.module';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DireccionesPageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ['places']
    }),
  ],
  entryComponents: [CuentaPage],
  declarations: [CuentaPage]
})
export class CuentaPageModule {}
