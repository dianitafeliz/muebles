import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { finalize } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-agregar-post',
  templateUrl: './agregar-post.component.html',
  styleUrls: ['./agregar-post.component.scss']
})
export class AgregarPostComponent implements OnInit {
  @Output() add_post = new EventEmitter<string>();
  public imagenes: any = [];
  public previsualizacion:string='';
  public loading: boolean=false;
  //Si el botón está deshabilitado
  disabled ='';

  addPostForm:FormGroup;
  codigo:string = '';
  errors: any = null;

  constructor(
    private sanitizer: DomSanitizer,
    public formulario:FormBuilder,
    public usuariosService:UsuariosService,
    public datepipe: DatePipe
  ) { 
    this.addPostForm=this.formulario.group({
      text:[null],
      image_id:[null],
      code:[''],
      date:[],
      likes:[0],
      responses:[0],
      status_id:[1],
      reply_to:[null],
      user_id:[]
    });
  }

  ngOnInit(): void {
  }

  //Genera el código de 10 digitos al azar
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  enviarDatos():void{
    if(this.addPostForm.value.text==null && this.addPostForm.value.image_id==null){
      window.alert("Su publicación está vacía");
      this.disabled ='';
    }else{
      let date: any = new Date();
      let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd, HH:mm:ss.SSS');
      this.codigo=this.makeid();
      this.addPostForm.controls['date'].setValue(latest_date);
      this.addPostForm.controls['code'].setValue(this.codigo);
      console.log(this.addPostForm);
  
      this.usuariosService.CreateMessage(this.addPostForm.value).pipe(finalize(()=>{
        console.log("Entro al complete")
        this.addPostForm=this.formulario.group({
          text:[null],
          image_id:[null],
          code:[''],
          date:[],
          likes:[0],
          responses:[0],
          status_id:[1],
          reply_to:[null],
          user_id:[]
        });
        this.disabled ='';
        this.previsualizacion='';
        this.add_post.emit();
  
        /* window.location.reload(); */
      })).subscribe(
        (result) => {
          console.log(this.addPostForm);
          console.log("Resultado:");
          console.log(result);
        },
        (error) => {
          this.errors = error.error;
          console.log(this.addPostForm);
        }
      );
  }
  }


  captureImage(event:any){
    const imagenCapturada=event.target.files[0];
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
    this.disabled ='no-pointer-events';
    if(this.addPostForm.value.image_id!==null){
    try {
      this.loading = true;
      const formularioDeDatos = new FormData();
      this.imagenes.forEach((imagen:string) => {
        console.log("Aquí está el valor de imagen e imagenes");
        console.log(imagen);
        console.log(this.imagenes);

        formularioDeDatos.append('image', imagen)
        console.log(formularioDeDatos);
      })
      // formularioDeDatos.append('_id', 'MY_ID_123')
      this.usuariosService.CreateImage(formularioDeDatos).pipe(finalize(() => {
        this.enviarDatos();
      })).subscribe((res:any) => {
          this.loading = false;
          this.addPostForm.controls['image_id'].setValue(res);
        })
    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);
    }

    }else{
      this.enviarDatos();
    }
  }
}
