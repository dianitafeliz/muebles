import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { TokenService } from './../../../../shared/token.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal-password',
  templateUrl: './modal-password.component.html',
  styleUrls: ['./modal-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalPasswordComponent implements OnInit {
  changedPassForm:FormGroup;
  constructor(
    public formulario:FormBuilder,
    public usuariosService:UsuariosService,
    public token: TokenService,
    private auth: AuthStateService,
    public router: Router
  ) {

    this.changedPassForm=this.formulario.group({
      password:['',[Validators.required, Validators.email]],
      confirmPassword:['',[Validators.required, Validators.email]],
      changed_password:[null]
    });
   }

  ngOnInit(): void {
  }
  enviarDatos(){
    if(this.changedPassForm.value.password === this.changedPassForm.value.confirmPassword && this.changedPassForm.value.password!==''){
      this.usuariosService.changingPassword(this.changedPassForm.value).subscribe((data:any)=>{
        window.location.reload();
      })
    }
  }

  //cerrar sesión
   signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['Iniciar_sesion']).then(() => {
      window.location.reload();
    });
  }
}
