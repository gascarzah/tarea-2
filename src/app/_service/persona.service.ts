import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http'
import { Persona } from '../_model/Persona';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaCambio = new Subject<Persona[]>();
  mensajeCambio = new Subject<string>();
  private url: string = `${environment.HOST}/personas`

  constructor(private http: HttpClient) { }


  listar(){
    return this.http.get<Persona[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Persona>(`${this.url}/${id}`);
  }

  registrar(persona: Persona) {
    return this.http.post(this.url, persona);
  }

  modificar(persona: Persona) {
    return this.http.put(this.url, persona);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

}
