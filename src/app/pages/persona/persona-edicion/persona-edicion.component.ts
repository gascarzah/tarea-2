import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { Persona } from 'src/app/_model/Persona';
import { PersonaService } from 'src/app/_service/persona.service';

@Component({
  selector: 'app-persona-edicion',
  templateUrl: './persona-edicion.component.html',
  styleUrls: ['./persona-edicion.component.css']
})
export class PersonaEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    console.log('llega aca personaedicion')
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),

    });

    this.route.params.subscribe((data: Params) => {
      console.log(data);
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  operar() {
    let persona = new Persona();
    persona.idPersona = this.form.value['id'];
    persona.nombres = this.form.value['nombres'];
    persona.apellidos = this.form.value['apellidos'];

    if (this.edicion) {
      //MODIFICAR
      //PRACTICA COMUN
      this.personaService.modificar(persona).subscribe(() => {
        this.personaService.listar().subscribe(data => {
          this.personaService.personaCambio.next(data);
          this.personaService.mensajeCambio.next('SE MODIFICÓ');
        });
      });
    } else {
      //REGISTRAR
      //PRACTICA IDEAL
      this.personaService.registrar(persona).pipe(switchMap(() => {
        return this.personaService.listar();
      })).subscribe(data => {
        this.personaService.personaCambio.next(data);
        this.personaService.mensajeCambio.next('SE REGISTRO');
      });
    }

    this.router.navigate(['persona']);
    console.log('entro')
  }

  initForm() {
    if (this.edicion) {
      this.personaService.listarPorId(this.id).subscribe(data => {
        console.log('edicion');
        console.log(data)
        this.form = new FormGroup({
          'id': new FormControl(data.idPersona),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),

        });
      });
    }
  }

}
