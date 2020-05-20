import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxMasonryModule } from 'ngx-masonry';

import { NegocioPageRoutingModule } from './negocio-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { NegocioPage } from './negocio.page';

import { LoginPageModule } from 'src/app/modals/login/login.module';
import { ProductoPageModule } from 'src/app/modals/producto/producto.module';
import { CuentaPageModule } from 'src/app/modals/cuenta/cuenta.module';
import { InfoSucursalPageModule } from 'src/app/modals/info-sucursal/info-sucursal.module';
import { ListImgComponent } from 'src/app/views/list-img/list-img.component';
import { BlockComponent } from 'src/app/views/block/block.component';
import { ListComponent } from 'src/app/views/list/list.component';
import { CardsComponent } from 'src/app/views/cards/cards.component';
import { GalleryComponent } from 'src/app/views/gallery/gallery.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LoginPageModule,
    NgxMasonryModule,
    CuentaPageModule,
    ProductoPageModule,
    InfoSucursalPageModule,
    NegocioPageRoutingModule
  ],
  declarations: [
    NegocioPage,
    ListComponent,
    CardsComponent,
    BlockComponent,
    GalleryComponent,
    ListImgComponent,
  ]
})
export class NegocioPageModule {}
