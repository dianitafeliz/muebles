import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../services/usuario';
import { UsuariosService } from '../../../services/usuarios.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  public imagenes: any = [];

  public previsualizacion:string='';

  public loading: boolean=false;

  id_current_img:number=0;
  singinForm:FormGroup;
  errors: any = null;
  sectorinput: any = null;
  sectorid:any = null;

  UserProfile!: Usuario;
  constructor(public UsuariosService: UsuariosService,
    private sanitizer: DomSanitizer,
      public formulario:FormBuilder,
      public router: Router,
      public datepipe: DatePipe) {
    this.UsuariosService.profileUser().subscribe((data: any) => {
      this.UserProfile = data;
      console.log("data del perfil:");
      console.log(data['image_id']);
      if(data['image_id']!=1){
      console.log("no es igual a 1");
      console.log(data['image_id']);
      this.id_current_img=data['image_id'];
      console.log(this.id_current_img);
      }
    });

      this.singinForm=this.formulario.group({
        id:[''],
        image_id:[''],
        current_image:[this.id_current_img]
      });
  }
  ngOnInit(): void {
  }
  enviarDatos():void{
    this.UsuariosService.set_changedProPic(this.singinForm.value).pipe(finalize(()=>{
      window.location.reload();
    })).subscribe(
      (result) => {
        console.log("Resultado:");
        console.log(result);
      },
      (error) => {
        this.errors = error.error;
        console.log(this.singinForm);
      },
     
    );
  }
  captureImage(event:any){
    const imagenCapturada= event.target.files[0];
    this.extraerBase64(imagenCapturada).then((imagen:any)=>{
      this.previsualizacion = imagen.base;
      console.log(imagen);
    })
    this.imagenes.push(imagenCapturada);
  }
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  procesarImagen(){
    if(this.singinForm.value.image_id!==null){
    try {
      this.loading = true;
      const formularioDeDatos = new FormData();
      this.imagenes.forEach((imagen:string) => {
        formularioDeDatos.append('image', imagen)
        console.log(formularioDeDatos);
      })
      // formularioDeDatos.append('_id', 'MY_ID_123')
      this.UsuariosService.CreateImage(formularioDeDatos).pipe(finalize(() => {
        this.enviarDatos();
      })).subscribe((res:any) => {

          this.loading = false;
          this.singinForm.controls['image_id'].setValue(res);
          this.singinForm.controls['current_image'].setValue(this.id_current_img);
        })
    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);
    }
    }
  }
}
