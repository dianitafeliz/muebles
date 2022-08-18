import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthStateService } from '../../../shared/auth-state.service';
import { TokenService } from '../../../shared/token.service';

class role{
  rol_id!:String;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  UserRole!: role;
  public paraiso_image!: string;
  errors:any = null;
  loginForm: FormGroup;
  constructor(
    private Usuarioss:UsuariosService,
    public router: Router,
    public formulario: FormBuilder,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.loginForm=this.formulario.group({
      email:[],
      password:[]
    });

    this.Usuarioss.profileUser().subscribe((data: any) => {
      this.UserRole = data;
    });
   }

  ngOnInit(): void {
    this.paraiso_image = "assets/img/logomuebles.png";
  }
  onLogin(event:Event){
    event.preventDefault();
    this.Usuarioss.signin(this.loginForm.value).subscribe(
      (result) => {
        this.responseHandler(result);
      },
      (error) => {
        this.errors = error.error;
      },
      () => {
        this.authState.setAuthState(true);
        this.loginForm.reset();
        this.redirecting();

      }
      );
    }
    //Redireccionamento
    redirecting(){
        this.router.navigate(['Home']).then(() => {
          window.location.reload();
        });
    }
      // Handle response
  responseHandler(data:any) {
    this.token.handleData(data.access_token);
  }
}