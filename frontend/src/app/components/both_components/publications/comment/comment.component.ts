import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  disabled ='';
  //Variable que almacena los archivos a subir 

  public imagenes: any = [];

  public previsualizacion:string='';

  public loading: boolean=false;


  singinForm:FormGroup;
  errors: any = null;
  sectorinput: any = null;
  sectorid:any = null;

  @Input() id_post: number=0;
  @Input() indice_post: number=0;

  //Se envia el indice y id del padre para actualizarlo
  @Output() incr_num_comment = new EventEmitter<any>();
  codigo:string = '';
  constructor(
    private sanitizer: DomSanitizer,
    public formulario:FormBuilder,
    public usuariosService:UsuariosService,
    public router: Router,
    public datepipe: DatePipe
  ) { 
    this.singinForm=this.formulario.group({
      text:[null],
      image_id:[null],
      code:[''],
      date:[],
      likes:[0],
      responses:[0],
      status_id:[1],
      reply_to:[1],
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
    if(this.singinForm.value.text==null && this.singinForm.value.image_id==null){
      window.alert("Su comentario está vacio");
      this.disabled ='';
    }else{
    let date: Date = new Date();
    let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd, HH:mm:ss.SSS');
    this.codigo=this.makeid();
    this.singinForm.controls['date'].setValue(latest_date);
    this.singinForm.controls['code'].setValue(this.codigo);
    this.singinForm.controls['reply_to'].setValue(this.id_post);
    console.log(this.singinForm);

    this.usuariosService.CreateMessage(this.singinForm.value).pipe(finalize(() => {
      this.disabled ='';
    })).subscribe(
      (result) => {
        console.log(this.singinForm);
        console.log("Resultado:");
        console.log(result);
      },
      (error) => {
        this.errors = error.error;
        console.log(this.singinForm);
      },
      () => {
        this.singinForm=this.formulario.group({
          text:[null],
          image_id:[null],
          code:[''],
          date:[date],
          likes:[0],
          responses:[0],
          status_id:[1],
          reply_to:[1],
          user_id:[]
        });
        this.previsualizacion='';

        if(this.id_post !== undefined){
        this.incr_num_comment.emit({id_post: this.id_post, indice: this.indice_post});
        }else{
          console.log("No está definido")
        }
      }
    );
    }
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
    this.disabled ='no-pointer-events';
    if(this.singinForm.value.image_id!=null){
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
          this.singinForm.controls['image_id'].setValue(res);
        }/* , () => {
          this.loading = false;
          alert('Error');
        } */)
    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);
    }

    }else{
      this.enviarDatos();
    }
  }
}
