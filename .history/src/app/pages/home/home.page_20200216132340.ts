import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, IonSlides } from '@ionic/angular';
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

  @ViewChild('slideCat', {static: false}) slide: IonSlides;

  ofertas: Oferta[] =  [ ];
  batch = 4;
  hayMas = false;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
  };

  slideCategoriaOpts = {
    centeredSlides: true,
    initialSlide: 0,
    slidesPerView: 3,
    speed: 400,
    autoHeight: true,
    spaceBetween: 20,
  };

  sld = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }
  
           $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
  
           if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
  
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
  };

  pedidos: Pedido[] = [];
  pedSub: Subscription;
  msgSub: Subscription;

  uidSub: Subscription;
  uid: string;

  categorias = [];

  categoria = {
    foto: '../../assets/img/categorias/restaurantes.png',
    clase: 'inactivo',
  }

  constructor(
    private router: Router,
    private modalController: ModalController,
    private pedidoService: PedidoService,
    private ofertaService: OfertasService,
    private chatService: ChatService,
    private uidService: UidService,
  ) {}

  ionViewWillEnter() {
    this.getUid();
    this.getOfertas();
    for (let index = 0; index < 12; index++) {
      this.categorias.push(this.categoria);
    }
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

  async ionSlideDidChange() {
    this.slide.updateAutoHeight();
    const i = await this.slide.getActiveIndex();
    // this.categorias.forEach(c => {
    //   c.clase = 'inactivo';
    // });
    console.log(i);
    // this.categorias[i].clase = 'activo';
    this.slide.updateAutoHeight();
    console.log(this.categorias);
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
