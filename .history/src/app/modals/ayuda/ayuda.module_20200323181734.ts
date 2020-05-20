import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyudaPage } from './ayuda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [AyudaPage],
  entryComponents: [AyudaPage]
})
export class AyudaPageModule {}
