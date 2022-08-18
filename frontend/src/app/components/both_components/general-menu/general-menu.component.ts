import { UsuariosService } from './../../../services/usuarios.service';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { TokenService } from '../../../shared/token.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-general-menu',
  templateUrl: './general-menu.component.html',
  styleUrls: ['./general-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralMenuComponent implements OnInit {
 //Almacenar error
 errors: any = null;

  //Almacenar usuario
 UserProfile!: Usuario;


  isSignedIn!: boolean;
  
  public image!: string;
  public paraiso_image!: string;
  mostrar= false;
  visibilidad='hide';
  fondo='';
  mostrarOcultar_menu(){
    this.mostrar = !this.mostrar;
    if(this.mostrar){
      this.visibilidad='';
      this.fondo='menu-icon-dado';
    }else{
      this.visibilidad='hide';
      this.fondo='';
    }
  }
  constructor(
    private auth: AuthStateService,
    public router: Router,
    public token: TokenService,
    public UsuariosService: UsuariosService
  ) {
    //Traer datos de usuario que inició sesión
    this.UsuariosService.profileUser().subscribe((data: any) => {
      this.UserProfile = data;
    },
    (error) => {
      this.errors = error.error;
      if(this.errors['message']=='Unauthenticated.'){
        console.log("No estas autenticado");
        this.token.removeToken();
        this.router.navigate(['Iniciar_sesion']);
      }
});
   }

  ngOnInit(): void {
    this.paraiso_image = "assets/img/logomuebles.png";
    this.image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
    });
  }
  // Signout
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['Iniciar_sesion']).then(() => {
      window.location.reload();
    });
  }
}
