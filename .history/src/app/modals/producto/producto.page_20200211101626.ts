import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Producto, ListaComplementos, Complemento } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  @Input() producto: Producto;
  @Input() idNegocio: string;

  variables: ListaComplementos[];
  obligatorios = 0;
  elegidos: Complemento[] = [];

  constructor(
    private modalCtrl: ModalController,
    private productoService: ProductoService,
  ) { }

  // Info entrada

  ngOnInit() {
    this.getVariables();
  }

  ionViewWillEnter() {
    this.producto.total = this.producto.precio;
    this.producto.cantidad = 1;
  }

  async getVariables() {
    this.variables = await this.productoService.getVariables(this.idNegocio, this.producto.id);
    this.obligatorios = 0;
    if (this.variables.length > 0) {
      this.variables.forEach(v => {
        if (v.obligatorio) {
          this.obligatorios++;
        }
      });
    } else {
      this.obligatorios = 0;
    }
  }

  // Acciones

  radioSelected(event, i) {
    const y = event.detail.value;
    let unidad = this.producto.total / this.producto.cantidad;
    if (this.variables[i].obligatorio && !this.variables[i].elegido) { this.obligatorios--; }
    if (!this.variables[i].elegido) {
      this.variables[i].elegido = true;
      unidad += this.variables[i].productos[y].precio;
      this.elegidos[i] = {
        nombre: this.variables[i].productos[y].nombre,
        precio: this.variables[i].productos[y].precio
      };
    } else {
      unidad -= this.elegidos[i].precio;
      unidad += this.variables[i].productos[y].precio;
      this.elegidos[i] = {
        nombre: this.variables[i].productos[y].nombre,
        precio: this.variables[i].productos[y].precio
      };
    }
    this.producto.total = this.producto.cantidad * unidad;
  }

  plusProduct() {
    const unidad = this.producto.total / this.producto.cantidad;
    this.producto.cantidad++;
    this.producto.total = this.producto.cantidad * unidad;
  }

  minusProduct() {
    if (this.producto.cantidad === 1) {
      return;
    }
    const unidad = this.producto.total / this.producto.cantidad;
    this.producto.cantidad--;
    this.producto.total = this.producto.cantidad * unidad;

  }


  // Salida

  agregarProducto() {
    this.producto.cantidad = this.producto.cantidad;
    this.producto.complementos = this.elegidos;
    this.modalCtrl.dismiss(this.producto.cantidad);
  }

  cerrar() {
    this.producto.cantidad = 0;
    this.modalCtrl.dismiss(null);
  }

}
