import { UsuariosService } from '../../../services/usuarios.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.scss']
})
export class DirectorioComponent implements OnInit, AfterContentChecked {
  //Datos que ingresa el usuario en el input buscador
  filteredString: any = '';

  totalRecords: any=0;
  actualPage:number=1;
  usuarios: any[] = [];
  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  obtenerUsuarios(){
    this.usuariosService.ObtenerUsuarios().subscribe(
      (data:any) => {
    this.usuarios = data;
    this.totalRecords = data.length;
    });
  }
  ngAfterContentChecked(){
    this.totalRecords = this.usuarios.length;
  }
}
