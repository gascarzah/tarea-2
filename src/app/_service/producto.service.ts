import { Injectable } from '@angular/core';
import { Producto } from '../_model/Producto';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  productoCambio = new Subject<Producto[]>();
  mensajeCambio = new Subject<string>();
  private url: string = `${environment.HOST}/productos`

  constructor(private http: HttpClient) { }


  listar(){
    return this.http.get<Producto[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  registrar(producto: Producto) {
    return this.http.post(this.url, producto);
  }

  modificar(producto: Producto) {
    return this.http.put(this.url, producto);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

}
