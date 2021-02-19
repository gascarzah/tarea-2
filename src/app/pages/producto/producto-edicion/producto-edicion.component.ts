import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductoService } from 'src/app/_service/producto.service';
import { Producto } from 'src/app/_model/Producto';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {
  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'marca': new FormControl(''),

    });

    this.route.params.subscribe((data: Params) => {
      console.log(data);
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  operar() {
    let producto = new Producto();
    producto.idProducto = this.form.value['id'];
    producto.nombre = this.form.value['nombre'];
    producto.marca = this.form.value['marca'];

    if (this.edicion) {
      //MODIFICAR
      //PRACTICA COMUN
      this.productoService.modificar(producto).subscribe(() => {
        this.productoService.listar().subscribe(data => {
          this.productoService.productoCambio.next(data);
          this.productoService.mensajeCambio.next('SE MODIFICÓ');
        });
      });
    } else {
      //REGISTRAR
      //PRACTICA IDEAL
      this.productoService.registrar(producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.productoCambio.next(data);
        this.productoService.mensajeCambio.next('SE REGISTRO');
      });
    }

    this.router.navigate(['producto']);
    console.log('entro')
  }

  initForm() {
    if (this.edicion) {
      this.productoService.listarPorId(this.id).subscribe(data => {

        this.form = new FormGroup({
          'id': new FormControl(data.idProducto),
          'nombre': new FormControl(data.nombre),
          'marca': new FormControl(data.marca),

        });
      });
    }
  }

}
