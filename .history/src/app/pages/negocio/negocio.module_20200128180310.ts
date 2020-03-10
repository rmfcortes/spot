import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegocioPageRoutingModule } from './negocio-routing.module';

import { NegocioPage } from './negocio.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NegocioPageRoutingModule
  ],
  declarations: [NegocioPage]
})
export class NegocioPageModule {}
