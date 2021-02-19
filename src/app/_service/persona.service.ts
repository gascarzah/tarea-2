import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http'
import { Persona } from '../_model/Persona';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PersonaService extends GenericService<Persona> {

  personaCambio = new Subject<Persona[]>();
  mensajeCambio = new Subject<string>();


  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/personas`)
  }

 //get Subjects
 getPersonaCambio() {
  return this.personaCambio.asObservable();
}

getMensajeCambio() {
  return this.mensajeCambio.asObservable();
}

//set Subjects
setPersonaCambio(personas: Persona[]) {
  this.personaCambio.next(personas);
}

setMensajeCambio(mensaje: string) {
  this.mensajeCambio.next(mensaje);
}
}
