import { finalize } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurar-password',
  templateUrl: './restaurar-password.component.html',
  styleUrls: ['./restaurar-password.component.scss']
})
export class RestaurarPasswordComponent implements OnInit {
  restoreForm:FormGroup;
    //Si el botón está deshabilitado
    disabled ='';
  constructor(
    public formulario:FormBuilder,
    public usuariosService:UsuariosService
    ) { 
      let today: Date = new Date();

      this.restoreForm=this.formulario.group({
        email:['',[Validators.required, Validators.email]],
        changed_password:[today],
        password:[''],
      })
    }

  ngOnInit(): void {
  }

    //Generar contraseña al azar
    public generateRandomPassword(n: number): string {
      let result = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-&'
      for (let i = 0; i < n; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    //Asignar la contraseña de acuerdo al email
    enviarDatos(){
      this.disabled='no-pointer-events';
      let today: any = new Date();
      let todayformat = this.ISOtoDate(today);
      console.log("Fecha:");
      console.log(today);
      console.log(todayformat);

      this.usuariosService.restore_pass(this.restoreForm.value).pipe(finalize(()=>{
        this.restoreForm=this.formulario.group({
          email:['',[Validators.required, Validators.email]],
          changed_password:[todayformat],
          password:[''],
        })
        this.disabled='';

      })).subscribe(()=>{
        console.log("Se restauro correctamente");
      })
    }

    ISOtoDate(date:any){
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let dt = date.getDate();

      if (dt < 10) {
        dt = '0' + dt;
      }
      if (month < 10) {
        month = '0' + month;
      }

      return(year+'-' + month + '-'+dt);
    }
}
