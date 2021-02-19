import { PersonaService } from './../../_service/persona.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Persona } from 'src/app/_model/Persona';
import {MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  displayedColumns = ['idPersona', 'nombres', 'apellidos', 'acciones']
  dataSource: MatTableDataSource<Persona>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private personaService: PersonaService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.personaService.personaCambio.subscribe(data => {
      this.crearTabla(data);
    });

    this.personaService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.personaService.listar().subscribe(data => {
      this.crearTabla(data);
    });
  }



  crearTabla(data: Persona[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(id: number){
    this.personaService.eliminar(id).pipe(switchMap(() => {
      return this.personaService.listar()
    })).subscribe(data =>{
      this.personaService.personaCambio.next(data);
      this.personaService.mensajeCambio.next('Se elimino')
    })
  }
}
