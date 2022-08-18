import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { finalize, of } from 'rxjs';

@Component({
  selector: 'app-mod-user',
  templateUrl: './mod-user.component.html',
  styleUrls: ['./mod-user.component.scss'],
})
export class ModUserComponent implements OnInit {
  //Array de usuarios a mostrar
  usuarios: any[] = [];

  modForm:FormGroup;
  errors: any = null;
  sectorinput: any = null;
  sectorid:any = null;

  constructor(
    private usuariosService: UsuariosService,
     private route: ActivatedRoute,
     public formulario:FormBuilder,
     public router: Router
     ) { 
       this.modForm=new FormGroup({
        email:new FormControl(''),
        number:new FormControl(''),
        first_name:new FormControl(''),
        second_name:new FormControl(''),
        first_surname:new FormControl(''),
        second_surname:new FormControl(''),
        rol_id:new FormControl(''),
        birthday:new FormControl(''),
        sector_id:new FormControl(''),
        area:new FormControl(''),
        position:new FormControl('')
/*         password:['123456'],
        image_id:['1'], */
       })
     }

/*   cargarUsuario():void{ 
     this.activatedRoute.params.subscribe(
      e=>{
        let id=e['id'];
        if(id){
          this.usuariosService.ObtenerUsuario(id).subscribe(
            us=>this.usuario=us
          );
        }
      }
    );
 */
//Obtener el usuario con sus datos de acuerdo al id
  obtenerUsuario(user_id: number){
    this.usuariosService.ObtenerUsuario(user_id).subscribe(
      (data:any) => {
        console.log(data);
        console.log(this.usuarios);
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
       this.usuarios.push(data);
       console.log(this.usuarios);
       
    }
  );
  }
  ngOnInit(): void {
    //Obtener el valor del id por medio de la url
    this.route.params.forEach((params: Params) => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.obtenerUsuario(id);
  });
  }
  
  //La función final para actualizar los datos
  actualizarDatos(){
    this.getid(this.modForm.value.area, this.modForm.value.position);
  }
  //Obtener el id de sector, en caso de no existir, crear registro
  getid(position:string, area:string):any{
      this.usuariosService.sectorid(area, position).pipe(finalize(() => {
        //Se actualiza el usuario
        this.usuariosService.UpdateUser(this.route.snapshot.params['id'], this.modForm.value).
        subscribe(()=>{
          console.log("Prueba");
          console.log(this.modForm);
  
          this.router.navigate(['Usuarios']);
        }
        )
    console.log("Intentado modificar");
      }))
      .subscribe((result) => {
      this.sectorid=result;
      this.modForm.controls['sector_id'].setValue(this.sectorid);
      
    if(result==null){
      this.new_sector();
    }
    return of(this.sectorid);
    });
  }

  //función para crear un nuevo sector en caso de no existir en la base de datos
  new_sector():void{
    this.usuariosService.setsector(this.modForm.value).subscribe(
      (result) => {
        this.usuariosService.sectorid(this.modForm.value.area, this.modForm.value.position).subscribe((result) => {
          this.getid(this.modForm.value.area, this.modForm.value.position);
        });
      },
      (error) => {
        this.errors = error.error;
        console.log(this.modForm);
  });
  }
}