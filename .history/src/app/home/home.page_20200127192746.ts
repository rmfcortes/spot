import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ofertas =  [
    'https://img-cdn.hipertextual.com/files/2019/12/hipertextual-ofertas-software-nuevo-ano-windows-10-pro-909-euros-office-2019-4549-euros-2019445220.jpg?strip=all&lossy=1&quality=55&resize=728%2C360&ssl=1',
    'https://www.journaldugeek.com/content/uploads/2019/06/190417-728-360-1280x720.jpg',
    'https://www.dolce-gusto.com.mx/media/wysiwyg/Banner_AlwaysON_split_dic.jpg'
  ];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    autoplay: true,
    speed: 400,
    loop: true,
  };

  constructor() {}

}
