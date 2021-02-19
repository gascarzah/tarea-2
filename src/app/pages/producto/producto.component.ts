
import { Component, OnInit, ViewChild } from '@angular/core';

import {MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { ProductoService } from 'src/app/_service/producto.service';
import { Producto } from 'src/app/_model/Producto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns = ['idProducto', 'nombre', 'marca', 'acciones']
  dataSource: MatTableDataSource<Producto>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private productoService: ProductoService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.productoService.productoCambio.subscribe(data => {
      this.crearTabla(data);
    });

    this.productoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.productoService.listar().subscribe(data => {
      this.crearTabla(data);
    });
  }



  crearTabla(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number){
    this.productoService.eliminar(id).pipe(switchMap(() => {
      return this.productoService.listar()
    })).subscribe(data =>{
      this.productoService.productoCambio.next(data);
      this.productoService.mensajeCambio.next('Se elimino')
    })
  }
}
