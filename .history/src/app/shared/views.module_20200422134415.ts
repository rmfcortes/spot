import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ListImgComponent } from 'src/app/views/list-img/list-img.component';
import { BlockComponent } from 'src/app/views/block/block.component';
import { ListComponent } from 'src/app/views/list/list.component';
import { CardsComponent } from 'src/app/views/cards/cards.component';
import { GalleryComponent } from 'src/app/views/gallery/gallery.component';

@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [
      ListComponent,
      CardsComponent,
      BlockComponent,
      GalleryComponent,
      ListImgComponent,
    ],
    exports: [
      ListComponent,
      CardsComponent,
      BlockComponent,
      GalleryComponent,
      ListImgComponent,
    ]
  })

  export class ViewsModule {}
