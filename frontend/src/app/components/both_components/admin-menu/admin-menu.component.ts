import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

//Clase que almacena el rol del usuario unicamente
class role{
  rol_id!:number;
}

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements AfterContentChecked{
//Variables utilizadas para almacenar
//componentes segun rol
  UserRole!: role;
  admin_us = '';
  administrador=false
  constructor(
    public UsuariosService: UsuariosService
    
    ){
      this.UsuariosService.profileUser().subscribe((data: any) => {
      this.UserRole = data;
    }); 
  }

  ngAfterContentChecked() {
    this.ocultar();
  }
//Función que verifica el rol y en base a este muestra/oculta el administrar usuarios
  ocultar(){
    if (this.UserRole?.rol_id == 2){

      this.administrador=true
      
    }
  }
}
