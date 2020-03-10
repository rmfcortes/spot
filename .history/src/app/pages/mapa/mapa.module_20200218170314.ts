import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPageRoutingModule } from './mapa-routing.module';
import { AgmCoreModule } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { MapaPage } from './mapa.page';
import { ChatPageModule } from 'src/app/modals/chat/chat.module';

import { environment } from 'src/environments/environment';
import { CalificarPageModule } from 'src/app/modals/calificar/calificar.module';
import { PedidoActivoPageModule } from 'src/app/modals/pedido-activo/pedido-activo.module';
import { PermisosPageModule } from 'src/app/modals/permisos/permisos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageModule,
    PermisosPageModule,
    CalificarPageModule,
    MapaPageRoutingModule,
    PedidoActivoPageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
  ],
  providers: [CallNumber],
  declarations: [MapaPage]
})
export class MapaPageModule {}
