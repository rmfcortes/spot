import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { OfertasPage } from 'src/app/modals/ofertas/ofertas.page';
import { LoginPage } from 'src/app/modals/login/login.page';

import { OfertasService } from 'src/app/services/ofertas.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ChatService } from 'src/app/services/chat.service';
import { UidService } from 'src/app/services/uid.service';


import { Oferta, InfoGral } from 'src/app/interfaces/negocio';
import { UnreadMsg } from 'src/app/interfaces/chat.interface';
import { Pedido } from 'src/app/interfaces/pedido';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ofertas: Oferta[] =  [ ];
  batch = 4;
  hayMas = false;

  slideOpts = {
    centeredSlides: true,
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
  };

  sld = {
    slidesPerView: 3,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;
  
        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
  
           let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);
  
           let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
  
           // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;
  
           const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  
           $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
          }
        }
  
         // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  }

  pedidos: Pedido[] = [];
  pedSub: Subscription;
  msgSub: Subscription;

  uidSub: Subscription;
  uid: string;

  categorias = [
    {
      visitas: 0,
      categoria: 'abarrotes',
      foto: '../../../assets/img/categorias/abarrotes.png'
    },
    {
      visitas: 0,
      categoria: 'automotriz',
      foto: '../../../assets/img/categorias/automotriz.png'
    },
    {
      visitas: 0,
      categoria: 'basicos',
      foto: '../../../assets/img/categorias/basicos.png'
    },
    {
      visitas: 0,
      categoria: 'belleza',
      foto: '../../../assets/img/categorias/belleza.png'
    },
    {
      visitas: 0,
      categoria: 'ferreteria',
      foto: '../../../assets/img/categorias/ferreteria.png'
    },
    {
      visitas: 0,
      categoria: 'moda',
      foto: '../../../assets/img/categorias/moda.png'
    },
    {
      visitas: 0,
      categoria: 'restaurantes',
      foto: '../../../assets/img/categorias/restaurantes.png'
    },
    {
      visitas: 0,
      categoria: 'salud',
      foto: '../../../assets/img/categorias/salud.png'
    },
    {
      visitas: 0,
      categoria: 'tecnologia',
      foto: '../../../assets/img/categorias/tecnologia.png'
    },
    {
      visitas: 0,
      categoria: 'viajes',
      foto: '../../../assets/img/categorias/viajes.png'
    },
];

verPedidos = false;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private ofertaService: OfertasService,
    private pedidoService: PedidoService,
    private chatService: ChatService,
    private uidService: UidService,
  ) {}

  async ionViewWillEnter() {
    this.getUid();
    this.getOfertas();
  }

  getUid() {
    this.uidSub = this.uidService.usuario.subscribe(uid => {
      if (uid) {
        this.uid = uid;
        this.getPedidosActivos();
      } else {
        this.uid = null;
        this.pedidos = [];
        if (this.pedSub) { this.pedSub.unsubscribe(); }
      }
    });
  }

  getPedidosActivos() {
    this.pedSub = this.pedidoService.getPedidosActivos().subscribe((pedidos: Pedido[]) => {
      this.pedidos = pedidos;
      if (this.pedidos.length === 0) {
        this.pedSub.unsubscribe();
      } else {
        this.listenNewMsg();
      }
    });
  }

  listenNewMsg() {
    this.msgSub = this.chatService.listenMsg().subscribe((unReadmsg: UnreadMsg[]) => {
      this.pedidos.forEach(p => {
        const i = unReadmsg.findIndex(u => u.idPedido === p.id);
        if (i >= 0) {
          p.unRead = unReadmsg[i].cantidad;
        } else {
          p.unRead = 0;
        }
      });
    });
  }

  async login() {
    const modal = await this.modalController.create({
      cssClass: 'my-custom-modal-css',
      component: LoginPage,
    });

    return await modal.present();
  }

  getOfertas() {
    this.ofertaService.getOfertas(this.batch + 1, 'todas').then((ofertas: Oferta[]) => {
      if (ofertas.length === this.batch + 1) {
        this.hayMas = true;
        ofertas.shift();
      }
      this.ofertas = ofertas.reverse();
    });
  }

  // Redirección

  irACategoria(categoria: string) {
    this.router.navigate(['/categoria', categoria]);
  }

  async irAOferta(oferta: Oferta) {
    const infoNeg: InfoGral = await this.ofertaService.getStatus(oferta.idNegocio);
    this.router.navigate(['/negocio', infoNeg.categoria, oferta.idNegocio, infoNeg.abierto]);
  }

  async verOfertas() {
    const modal = await this.modalController.create({
      component: OfertasPage,
      componentProps: {categoria: 'todas', batch: this.batch}
    });

    return modal.present();
  }

  ionViewWillLeave() {
    if (this.pedSub) { this.pedSub.unsubscribe(); }
    if (this.uidSub) { this.uidSub.unsubscribe(); }
    if (this.msgSub) { this.msgSub.unsubscribe(); }
  }

}
