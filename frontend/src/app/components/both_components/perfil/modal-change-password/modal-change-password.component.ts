import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { TokenService } from './../../../../shared/token.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss']
})
export class ModalChangePasswordComponent implements OnInit {
  @Output() closeItemEvent = new EventEmitter<boolean>();

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
    if(this.changedPassForm.value.password === this.changedPassForm.value.confirmPassword && this.changedPassForm.value.password.length>6 && this.changedPassForm.value.password.length<16){
      this.usuariosService.changingPassword(this.changedPassForm.value).pipe(finalize(() => {
        window.alert("Se cambió la contraseña");
      })).subscribe((data:any)=>{
        window.location.reload();
      })
    }else{
    window.alert("No se pudo cambiar la contraseña");
  }
  }
  //cerrar popup
   close() {
    this.closeItemEvent.emit(false);
  }
}
