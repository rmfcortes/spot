import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegocioServiciosPageRoutingModule } from './negocio-servicios-routing.module';

import { NegocioServiciosPage } from './negocio-servicios.page';

import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish.directive';
import { TitleScrollVanishDirective } from 'src/app/directives/scroll-vanish-title.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegocioServiciosPageRoutingModule
  ],
  declarations: [NegocioServiciosPage, ScrollVanishDirective, TitleScrollVanishDirective]
})
export class NegocioServiciosPageModule {}
