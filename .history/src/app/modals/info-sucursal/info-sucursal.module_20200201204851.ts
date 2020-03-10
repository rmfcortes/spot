import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoSucursalPageRoutingModule } from './info-sucursal-routing.module';

import { InfoSucursalPage } from './info-sucursal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoSucursalPageRoutingModule
  ],
  declarations: [InfoSucursalPage]
})
export class InfoSucursalPageModule {}
