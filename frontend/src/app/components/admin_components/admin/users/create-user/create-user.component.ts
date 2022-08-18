import { finalize } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  disabled ='';
  singinForm:FormGroup;
  //Almacena los mensajes de error
  errors: any = null;
  password:string="";
  sectorinput: any = null;
  sectorid:any = null;

  /*   singinForm = new FormGroup({
  email: new FormControl(''),
  number: new FormControl(''),
  f_name: new FormControl(''),
  s_name: new FormControl(''),
  f_surname: new FormControl(''),
  s_surname: new FormControl(''),
  rol: new FormControl(''),
  birthday: new FormControl(''),
  area: new FormControl(''),
  position: new FormControl(''),
})  */
  constructor(
    public formulario:FormBuilder,
    public usuariosService:UsuariosService,
    public router: Router,
    ) {
      let today: any = new Date();
      today = this.ISOtoDate(today);
      
      this.password=this.generateRandomPassword(16);
      
      this.singinForm=this.formulario.group({
        email:['',[Validators.required, Validators.email]],
        number:[''],
        first_name:[''],
        second_name: [],
        first_surname:[''],
        second_surname:[],
        rol_id:[''],
        changed_password:[today],
        password:[this.password],
        image_id:['1'],
        birthday:[''],
        sector_id: [''],
        area:[''],
        position:['']
      });
}
ngOnInit() {}
  enviarDatos():void{
    this.disabled ='no-pointer-events';
    this.getid(this.singinForm.value.area, this.singinForm.value.position);
    }
  getid(position:string, area:string):void{
    this.usuariosService.sectorid(area, position).pipe(finalize(() => {
      this.registrarDatos();
    }))
    .subscribe((result) => {
      this.sectorid=result;
      this.singinForm.controls['sector_id'].setValue(this.sectorid);
      
    if(result==null){
      this.new_sector();
    }
    });

  }
  registrarDatos():void{
    console.log("El sector id es" + this.singinForm.value.sector_id)
    this.usuariosService.register(this.singinForm.value).subscribe(
      (result) => {
        this.disabled ='';
        console.log(this.singinForm);
        console.log(result);
      },
      (error) => {
        this.disabled ='';
        this.errors = error.error;
        console.log(this.singinForm);
      },
      () => {
        this.disabled ='';
        this.singinForm.reset();
        this.router.navigate(['Usuarios']);
      }
    );
  }

  //Función para crear un nuevo sector en caso de no existir en la base de datos
  new_sector():void{
    this.usuariosService.setsector(this.singinForm.value).subscribe(
      (result) => {
        this.usuariosService.sectorid(this.singinForm.value.area, this.singinForm.value.position).subscribe((result) => {
          this.getid(this.singinForm.value.area, this.singinForm.value.position);
        });
      },
      (error) => {
        this.errors = error.error;
        console.log(this.singinForm);
  });
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