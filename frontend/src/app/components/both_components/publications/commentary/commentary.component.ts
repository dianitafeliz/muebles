import { finalize, Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { EventEmitter, Component, OnInit, Input, AfterViewInit, OnDestroy, Output } from '@angular/core';


//Clase que almacena el rol del usuario unicamente
class role{
  rol_id!:number;
}


@Component({
  selector: 'app-commentary',
  templateUrl: './commentary.component.html',
  styleUrls: ['./commentary.component.scss']
})
export class CommentaryComponent implements OnInit, AfterViewInit, OnDestroy {
  //index de los comentarios
  totalRecords: number=0;
  page: any = null;
  errors: any = null;
  disabled ='';

 //Variables utilizadas para mostrar
  //componentes segun rol
  UserRole!: role;
  admin_us = '';
  administrador=false
  Userid:number = -1;

  @Input() id_post: number=0;
  @Input() comentarios: any[] = [];
  @Input() is_admin:boolean = false;
  @Input() id_pub: any[] = [];
  @Input() indice_post: number=0;

  //Se envia la cantidad de comentarios para actualizarlo
  @Output() act_num_comment = new EventEmitter<any>();

  //Se envia el indice y id del padre para actualizarlo
  @Output() incr_num_comment2:EventEmitter<any> = new EventEmitter<any>();

  private commentaries:Subscription | undefined;

  constructor(  
    public UsuariosService: UsuariosService,
/*     public commentaries:Subscription */
    ) {
      this.UsuariosService.profileUser().subscribe((data: any) => {
        this.Userid = data['id'];
      });
     }

    ngAfterViewInit() {
      this.ocultar();
    }


  ngOnInit(): void {
    this.ObtenerPost(this.id_post);

    //

    this.commentaries = this.UsuariosService.refresh_commentary$.subscribe(()=>{

      this.ObtenerPost(this.id_post);
    })
/*     this.ObtenerPost(id:number);
 */  }


 ngOnDestroy(): void {
   this.commentaries?.unsubscribe();
   console.log("Observable cerrado");
 }


 
//Obtener comentario
ObtenerPost(id:number){
  this.UsuariosService.get_commentary(id, 1).pipe(finalize(() => {
    this.Traerreaciones();
    this.totalRecords=this.comentarios.length;

    //Se agreda la propiedad de editar comentarios de acuerdo al id_user
    
    this.comentarios.forEach(element => {
      //Se muestra la imagen del perfil
      this.UsuariosService.get_profile_image(element['user_id']).subscribe((direccion:any) => {
        Object.defineProperty(element, 'pro_picture', {
          value: direccion['image_direction'],
          writable: true
        })
      });

      if(this.Userid==element['user_id']){
        Object.defineProperty(element, 'coment_own', {
          value: true,
          writable: true
        })
      };

    }); 
  }))
  .subscribe((data:any) => {
    console.log("Data de comentarios paginados:");
    console.log(data)
  this.comentarios = data['data'];
  if(data['next_page_url']!=null){
    this.page=Number(data['next_page_url'].substr(-1));
  }else{
    this.page=null;
  }
  Object.defineProperty(this.comentarios, 'isComment', {
    value: false,
    writable: true
  })
//Se le agrega una propiedad a todos los comentarios que dicen si son visibles o no
  this.comentarios.forEach(comentario=>{
    Object.defineProperty(comentario, 'isVisible', {
      value: false,
      writable: true
    });

     //Se le añade la propiedad para saber si se dio a las opciones
     Object.defineProperty(comentario, 'isOptions', {
      value: false,
      writable: true
    })
  })
  //Se carga el primer comentario
  this.cargar_comment(0);
  //Se carga el segundo comentario
  this.cargar_comment(1);
  //Se carga el tercer comentario
  this.cargar_comment(2);
/*   console.log("Comentarios:")
  console.log(this.comentarios.length) */
  }
);

}


/* Eliminar comentario */
borrarPost(message_id: number, replyto: number,image_id: number){
  if(window.confirm("¿Esta seguro de borrar este comentario? ")) {
  
    this.UsuariosService.updateresponses_decr(this.id_post, this.comentarios,message_id ).pipe(finalize(() => {
      //Borrar mensaje
      this.UsuariosService.BorrarPost(message_id).pipe(finalize(() => {
        if(image_id!=null){
          this.UsuariosService.BorrarImagen(image_id).subscribe(
            (data:any)=>{
              console.log(data);
            }
          )
        }
      })).subscribe(next=>{
        this.ObtenerPost(replyto);
      }
      );

    })).subscribe((result) => {
      console.log("Número de respuestas");
      console.log(this.comentarios[this.indice_post]);
      this.act_num_comment.emit({indice: this.indice_post.toString(), num: -result});
      });
}
}


/*Verifica que el usuario sea administrador */
ocultar(){
  if (this.UserRole?.rol_id == 2){

    this.administrador=true
    
  }
}



//Trae las reacciones si existen
Traerreaciones(){
  let i=0;
  this.comentarios.forEach(element => {
    console.log(element.text);
    console.log( typeof element.text);

    this.UsuariosService.ObtenerReaccion(element.id).subscribe((data:any)=>{

      /* Se le asigna una nueva propiedad al objeto de publicaciones
      que almacene temporalmente si el usuario
      Le ha dado like a alguna publicación */
      //Si no hay relaciones del usuario y la publicación, no se ha reaccionado a esta
        if(data==null){
          console.log("El valor es nulo");
          Object.defineProperty(this.comentarios[i], 'isReaction', {
            value: false,
            writable: true
          });
      //En caso de que hayan relaciones entre el usuario que inicio sesión y la publicación, se ha reaccionado a esta
        }else{
          this.disabled='';
          console.log("El valor es valido");
          Object.defineProperty(this.comentarios[i], 'isReaction', {
            value: true,
            writable: true
          })
      //Añadir el id de reaccion al objeto de message  
          Object.defineProperty(this.comentarios[i], 'idReaction', {
            value: data['id'],
            writable: true,
          });
        }
        i++;
        }
        );
  });
}




  /* que se muestren u oculten los me gustas */
  onEditClick_crz(id:number, i:number) {
    this.disabled ='no-pointer-events';
    console.log("Ejemplo");
    console.log(this.comentarios)
    //----------Borrar la reacción-----------
    if(id!==undefined){
      console.log("Borrar");
      this.UsuariosService.BorrarReaccion(id).pipe(finalize(() => {
    //Definir el id como undefined
         Object.defineProperties(this.comentarios[i], {
           idReaction: {
             value: undefined,
             writable: true,
           },
         });
         //Restarle uno a la cantidad actual de likes
         console.log(this.comentarios[i].likes-1);
         this.UsuariosService.updatelikes_decr(this.comentarios[i].message_id, this.comentarios[i]).pipe(finalize(() => {
          this.comentarios[i].likes=this.comentarios[i].likes-1;
          this.disabled ='';
         })).subscribe((result) => {
           this.disabled ='';
         });
      })).subscribe((data: any) => {
      }); 

    //----------Crear la reacción----------
    }else{  
      if(id==undefined){
                  console.log("Crear");
                  let json=JSON.parse(JSON.stringify(this.comentarios[i]));
                  this.UsuariosService.setreaction(json).pipe(finalize(() => {
                    //Añadir el id de reaccion al objeto de message  
                    this.UsuariosService.ObtenerReaccion(this.comentarios[i].message_id).subscribe((data:any)=>{
                      Object.defineProperty(this.comentarios[i], 'idReaction', {
                        value: data['id'],
                        writable: true,
                      });
                    })
                  })).subscribe(
                    (data:any) => {

                //Sumarle uno a la cantidad actual de likes
                console.log(this.comentarios[i].likes+1);
                this.comentarios[i].likes=this.comentarios[i].likes+1;
                this.UsuariosService.updatelikes_incr(this.comentarios[i].message_id, this.comentarios[i]).pipe(finalize(() => {
                  console.log(" agregar likes");
                  this.disabled ='';
                    }))
                .subscribe(() => {
                });
                   });
          }
        }
         //Asignar el valor del isReaction (si está reaccionado o no)
         Object.defineProperties(this.comentarios[i], {
          isReaction: {
            value: !this.comentarios[i].isReaction,
            writable: true,
          },
        });
  }




//----------------COMENTARIOS------------------

onEditClick_cm(id: number) {
  if (!this.comentarios[id].isComment) {
    Object.defineProperty(this.comentarios[id], 'isComment', {
      value: true,
      writable: true,
    });

  } else {
    Object.defineProperty(this.comentarios[id], 'isComment', {
      value: false,
      writable: true,
    });
  }
  }
//Añadir la propiedad de visible a los siguientes tres elementos
loadmore(){
  console.log("Pagina:")
  console.log(this.page);
  this.UsuariosService.get_commentary(this.id_post, this.page).subscribe((data: any)=>{
    if(data['next_page_url']!=null){
      this.page=Number(data['next_page_url'].substr(-1));
    }else{
      this.page=null;
    }
    
    data['data'].forEach((element:any) => {
      
      if(this.Userid==element['user_id']){
        Object.defineProperty(element, 'coment_own', {
          value: true,
          writable: true
        })
      };

      if(data==null){
        console.log("El valor es nulo");
        Object.defineProperty(element, 'isReaction', {
          value: false,
          writable: true
        });
    //En caso de que hayan relaciones entre el usuario que inicio sesión y la publicación, se ha reaccionado a esta
      }else{
   
        this.UsuariosService.ObtenerReaccion(element.id).subscribe((data:any)=>{

          /* Se le asigna una nueva propiedad al objeto de publicaciones
          que almacene temporalmente si el usuario
          Le ha dado like a alguna publicación */
          //Si no hay relaciones del usuario y la publicación, no se ha reaccionado a esta
            if(data==null){
              console.log("El valor es nulo");
              Object.defineProperty(element, 'isReaction', {
                value: false,
                writable: true
              });
          //En caso de que hayan relaciones entre el usuario que inicio sesión y la publicación, se ha reaccionado a esta
            }else{
              this.disabled='';
              console.log("El valor es valido");
              Object.defineProperty(element, 'isReaction', {
                value: true,
                writable: true
              })
          //Añadir el id de reaccion al objeto de message  
              Object.defineProperty(element, 'idReaction', {
                value: data['id'],
                writable: true,
              });
            }
            });
      }

        //Se muestra la imagen del perfil
        this.UsuariosService.get_profile_image(element['user_id']).subscribe((direccion:any) => {
          Object.defineProperty(element, 'pro_picture', {
            value: direccion['image_direction'],
            writable: true
          })
        });
      this.comentarios.push(element);
    });
    this.comentarios.forEach(element => {

      if(this.Userid==element['user_id']){
        console.log("Hola si entró")
        Object.defineProperty(element, 'coment_own', {
          value: true,
          writable: true
        })
      };
    });
    console.log("A ver que sucede");
    console.log(this.comentarios);
  });
  /* 
  let i:number=0;
  while (i<3) {
    
    if(this.index < this.comentarios.length){
      console.log("Variable i:");
      console.log(i);
      console.log("Variable index:");
      console.log(this.index);
      this.cargar_comment(this.index);
      this.index=this.index+1;
    } */
/*     for (let index = 2; index < this.comentarios.length; index++) {
      //Se carga el primer comentario
      this.cargar_comment(index);
  } */
    //i=i+1;
/*   } */

}

//Asignarle la variable de visibilidad a x número
cargar_comment(number:number){
  if(this.comentarios[number]){
    Object.defineProperty(this.comentarios[number], 'isVisible', {
      value: true,
      writable: true
    });
}
}

 //Mostrar/ocultar las opciones de editar y eliminar
 mostrarOcultar_opciones(index:number){
  console.log("holis")
  console.log(this.comentarios[index]);
   //Se le añade la propiedad para saber si se dio a las opciones
   if(this.comentarios[index].isOptions){
   Object.defineProperty(this.comentarios[index], 'isOptions', {
    value: false,
    writable: true
  })
}else{
  Object.defineProperty(this.comentarios[index], 'isOptions', {
    value: true,
    writable: true
  })
}
}


recibirMensaje(mensaje: any){
  this.comentarios[Number(mensaje.indice)].responses = this.comentarios[Number(mensaje.indice)].responses+mensaje.num;
console.log("mensaje:")
console.log(this.id_post)
     if(mensaje.num<0){
    this.UsuariosService.simpleupdateresponses_decr(this.comentarios[Number(mensaje.indice)].id, this.comentarios, Math.abs(mensaje.num)).subscribe(()=>{
      
    });
  }
  //Si existe un padre (si no es publicación, se resta 1 a responses)
  if(this.indice_post !== undefined){
    this.act_num_comment.emit({indice: this.indice_post.toString(), num: mensaje.num})  
  }
}

recibir_padre_post(mensaje: any){
  console.log("Mensaje 2:");
  console.log(mensaje);
  console.log("responses");

  this.UsuariosService.updateresponses_incr(mensaje.id_post, this.comentarios[mensaje.indice].responses).subscribe((result) => {
    this.comentarios[this.indice_post].responses=this.comentarios[this.indice_post].responses+1;
/*     console.log("resultado de emit 2")
    console.log(mensaje.indice + this.id_post) */
  
/*     if(this.id_post !== undefined){
      console.log("this.id_post");
      this.UsuariosService.updateresponses_incr(mensaje, this.comentarios[mensaje].responses).subscribe((result) => {
      });
    } */
});
if(mensaje.id_post !== undefined || null){
  console.log("id_post " + this.id_post + " y " + this.indice_post )
  this.incr_num_comment2.emit({id_post: this.id_post, indice: this.indice_post});
}
}
/* recibir_padre_po(event: any){
  console.log("segunda función")
  this.incr_num_commentl.emit("Auxilio");
console.log(event)
} */
otrafuncion(event: any){
/*   console.log("No entra a otra función:");
  console.log(event); */
  this.UsuariosService.updateresponses_incr(event.id_post, this.comentarios[event.indice].responses).subscribe((result) => {
    this.comentarios[this.indice_post].responses=this.comentarios[this.indice_post].responses+1;
/*     console.log(result); */
  });
  if(event.id_post !== undefined || null){
    this.incr_num_comment2.emit({id_post: this.id_post, indice: this.indice_post});
  }
}
}