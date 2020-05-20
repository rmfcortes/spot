import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgmCoreModule } from '@agm/core';

import { AvancesPageRoutingModule } from './avances-routing.module';

import { AvancesPage } from './avances.page';

import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvancesPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
  ],
  declarations: [AvancesPage]
})
export class AvancesPageModule {}
