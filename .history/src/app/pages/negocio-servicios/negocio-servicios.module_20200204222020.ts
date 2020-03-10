import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegocioServiciosPageRoutingModule } from './negocio-servicios-routing.module';

import { NegocioServiciosPage } from './negocio-servicios.page';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { InfoSucursalPageModule } from 'src/app/modals/info-sucursal/info-sucursal.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InfoSucursalPageModule,
    NegocioServiciosPageRoutingModule
  ],
  providers: [
    CallNumber,
    SocialSharing
  ],
  declarations: [NegocioServiciosPage]
})
export class NegocioServiciosPageModule {}
