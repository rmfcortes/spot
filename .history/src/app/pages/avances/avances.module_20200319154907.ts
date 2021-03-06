import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { AgmCoreModule } from '@agm/core';

import { AvancesPageRoutingModule } from './avances-routing.module';

import { AvancesPage } from './avances.page';
import { PedidoActivoPageModule } from 'src/app/modals/pedido-activo/pedido-activo.module';

import { environment } from 'src/environments/environment';
import { CalificarPageModule } from 'src/app/modals/calificar/calificar.module';
import { ChatPageModule } from 'src/app/modals/chat/chat.module';
import { PermisosPageModule } from 'src/app/modals/permisos/permisos.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvancesPageRoutingModule,
    PedidoActivoPageModule,
    CalificarPageModule,
    PermisosPageModule,
    ChatPageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
  ],
  providers: [ CallNumber ],
  declarations: [AvancesPage]
})
export class AvancesPageModule {}
