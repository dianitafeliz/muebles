import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterContentChecked{  
  //Datos que ingresa el usuario en el input buscador
  filteredString: any = '';

  totalRecords: any=0;
  actualPage:number=1;
  usuarios: any[] = [];
  constructor(private usuariosService: UsuariosService) { }
//Almacenar los datos en un array para luego utilizarlos con un foreach
  obtenerUsuarios(){
    this.usuariosService.ObtenerUsuarios().subscribe(
      (data:any) => {
/*       console.log("Adios" + data);
 */      this.usuarios = data;
          this.totalRecords = data.length
/*       console.log(this.usuarios); */
console.log(this.usuarios);
    }
  );
  }
  borrarUsuario(user_id: number){
    if(window.confirm("¿Esta seguro de borrar este usuario? ")) {
    this.usuariosService.BorrarUsuario(user_id).subscribe(next=>{
      this.obtenerUsuarios();
    }); }
  }

  ngOnInit(): void {
    this.obtenerUsuarios();

  }
  ngAfterContentChecked(){
    this.totalRecords = this.usuarios.length;
  }

}
      
/*     this.usuariosService.ObtenerUsuario().subscribe(
      data => {
      console.log("Hola" + data);
    }
  );
  }
 */



/*    this.usuariosService.ObtenerUsuario().subscribe({
      next(data: any){ 
      console.log("Hola" + data); */