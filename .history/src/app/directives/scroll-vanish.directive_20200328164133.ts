
// hide-header.directive.ts - this directive will do the actual job to hide header on content scroll in Ionic Framework.

import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
    selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

    @Input('header') header: any;

    private lastY = 0;

    constructor(
        private renderer: Renderer2,
        private domCtrl: DomController
    ) { }

    ngOnInit(): void {
      setTimeout(() => {        
        this.header = this.header.el;
        this.domCtrl.write(() => {
            this.renderer.setStyle(this.header, 'transition', 'margin-top 700ms');
        });
      }, 50000);
    }

    @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
        if ($event.detail.scrollTop > this.lastY) {
            this.domCtrl.write(() => {
                this.renderer.setStyle(this.header, 'margin-top', `-${ this.header.clientHeight }px`);
            });
        } else {
            this.domCtrl.write(() => {
                this.renderer.setStyle(this.header, 'margin-top', '0');
            });
        }

        this.lastY = $event.detail.scrollTop;
    }

}


// import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
// import { DomController } from '@ionic/angular';

// @Directive({
//   selector: '[appScrollVanish]'
// })
// export class ScrollVanishDirective implements OnInit {

//   @Input('appScrollVanish') scrollArea;

//   private hidden = false;
//   private triggerDistance = 20;

//   constructor(
//     private element: ElementRef,
//     private renderer: Renderer2,
//     private domCtrl: DomController
//   ) { }

//   ngOnInit() {
//     this.initStyles();

//     this.scrollArea.ionScroll.subscribe(scrollEvent => {
//       const delta = scrollEvent.detail.deltaY;
//       if (scrollEvent.detail.currentY === 0 && this.hidden) {
//         this.show();
//       } else if (!this.hidden && delta > this.triggerDistance) {
//         this.hide();
//       } else if (this.hidden && delta < -this.triggerDistance) {
//         this.show();
//       }
//     });
//   }

//   initStyles() {
//     this.domCtrl.write(() => {
//       this.renderer.setStyle(
//         this.element.nativeElement,
//         'transition',
//         '1s linear'
//       );
//       this.renderer.setStyle(this.element.nativeElement, 'height', '120px');
//     });
//   }

//   hide() {
//     this.domCtrl.write(() => {
//       this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
//       this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
//       this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
//       this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
//     });

//     this.hidden = true;
//   }

//   show() {
//     this.domCtrl.write(() => {
//       this.renderer.setStyle(this.element.nativeElement, 'height', '120px');
//       this.renderer.removeStyle(this.element.nativeElement, 'opacity');
//       this.renderer.removeStyle(this.element.nativeElement, 'min-height');
//       this.renderer.removeStyle(this.element.nativeElement, 'padding');
//     });

//     this.hidden = false;
//   }

// }
