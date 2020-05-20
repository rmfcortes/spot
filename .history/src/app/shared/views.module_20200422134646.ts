import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ListImgComponent } from 'src/app/views/list-img/list-img.component';
import { BlockComponent } from 'src/app/views/block/block.component';
import { ListComponent } from 'src/app/views/list/list.component';
import { CardsComponent } from 'src/app/views/cards/cards.component';
import { GalleryComponent } from 'src/app/views/gallery/gallery.component';
import { PreloadImageComponent } from '../components/pre-load-image/pre-load-image.component';

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
      PreloadImageComponent,
    ],
    exports: [
      ListComponent,
      CardsComponent,
      BlockComponent,
      GalleryComponent,
      ListImgComponent,
      PreloadImageComponent,
    ]
  })

  export class ViewsModule {}
