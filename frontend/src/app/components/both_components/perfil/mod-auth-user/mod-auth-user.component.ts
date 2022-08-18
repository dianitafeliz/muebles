import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Usuario } from './../../../../services/usuario';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-mod-auth-user',
  templateUrl: './mod-auth-user.component.html',
  styleUrls: ['./mod-auth-user.component.scss']
})
export class ModAuthUserComponent implements OnInit {
  modalPassSwitch:boolean=false;
  UserProfile!: Usuario;

  usuario: any[] = [];

  modForm:FormGroup;
  errors: any = null;
  sectorinput: any = null;
  sectorid:any = null;
  constructor(
    public UsuariosService: UsuariosService,
    private route: ActivatedRoute,
    public formulario:FormBuilder,
    public router:Router,
    ) {
      this.modForm=new FormGroup({
        number:new FormControl(''),
/*         birthday:new FormControl(''), */
/*         password:['123456'],
        image_id:['1'], */
       })
     }


  ngOnInit(): void {
    this.obtenerUsuario();
  }
  obtenerUsuario(){
    this.UsuariosService.profileUser().subscribe(
      (data:any) => {
        console.log(data);
        this.UserProfile = data;
        console.log(this.usuario);
        this.modForm=new FormGroup({
          email:new FormControl(data['email']),
          number:new FormControl(data['number']),
          first_name:new FormControl(data['first_name']),
          second_name:new FormControl(data['second_name']),
          first_surname:new FormControl(data['first_surname']),
          second_surname:new FormControl(data['second_surname']),
          rol_id:new FormControl(data['rol_id']),
          birthday:new FormControl('2022-09-12'),
          sector_id:new FormControl(data['sector_id']),
          area:new FormControl(data['area']),
          position:new FormControl(data['position'])
  /*         password:['123456'],
          image_id:['1'], */
         })
       this.usuario.push(data);
       console.log(this.usuario);
       
    }
  );
  }  
   //La función final para actualizar los datos
   actualizarDatos(){
    console.log(this.usuario[0].id);
    this.UsuariosService.UpdateUser(this.usuario[0].id, this.modForm.value).subscribe(
      (result) => {
        console.log(result);
        this.router.navigate(['Mi_perfil']);
      },
      (error) => {
        this.errors = error.error;
        console.log(this.modForm);
  });
  }

  hideComponent(status: boolean){
    console.log("Hola")
    this.modalPassSwitch=status;
  }

  showComponent(){
    this.modalPassSwitch=true;
  }
}
