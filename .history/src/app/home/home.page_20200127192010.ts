import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    autoplay: true,
    speed: 400,
    loop: true,
  };

  constructor() {}

}
