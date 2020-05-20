import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {

  @Input('appScrollVanish') scrollArea;

  private hidden = false;
  private triggerDistance = 20;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      const delta = scrollEvent.detail.deltaY;
      console.log(delta);
      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show(delta);
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show(delta);
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        'transition',
        '1s linear'
      );
      this.renderer.setStyle(this.element.nativeElement, 'height', '120px');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
    });

    this.hidden = true;
  }

  show(delta) {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', delta+'px');
      // this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      // this.renderer.removeStyle(this.element.nativeElement, 'min-height');
      // this.renderer.removeStyle(this.element.nativeElement, 'padding');
    });

    this.hidden = false;
  }

}
