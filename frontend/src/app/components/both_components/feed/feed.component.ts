import { finalize } from 'rxjs';
import { Component, AfterContentChecked, HostListener, Inject, Input } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DOCUMENT } from '@angular/common';

//Clase que almacena el rol del usuario unicamente
class role{
  rol_id!:number;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements AfterContentChecked {
  throttle = 300;  
  scrollDistance = 1;  
  scrollUpDistance = 2;  
  
  showButton = false;
  @HostListener('window:scroll')
  onWindowScroll(): void{
    const yOffSet = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > 500;
  }

  publicacionesByPage: any[] = [];

  publicaciones: any[] = [];
  id_post: any[] = [];
  nextPage: number=0;
  filter: boolean=false;
  input: string = '';

  //
  errors: any = null;
  disabled ='';
  //Variables utilizadas para mostrar
  //componentes segun rol
  UserRole!: role;
  admin_us = '';
  administrador=false
  
constructor(
  @Inject(DOCUMENT) private document: Document,
  public UsuariosService: UsuariosService
  
  ){
    this.UsuariosService.profileUser().subscribe((data: any) => {
    this.UserRole = data;
    this.ObtenerPost();
  }); 
}

ngAfterContentChecked() {
  this.ocultar();
}




//Obtener la lista de publicaciones
ObtenerPost(){
  this.filter = false;
  this.UsuariosService.pruebaByPage(1).pipe(finalize(() => {    
    this.Traerreaciones();
    this.posts();
  }))
  .subscribe((data:any) => {
    if(typeof data['next_page_url'] === 'string'){
      console.log(data['next_page_url'].substr(-1));
      this.nextPage=Number(data['next_page_url'].substr(-1));
    }
    this.publicaciones = data['data'];
    
    this.publicaciones.forEach(element => {

      this.UsuariosService.get_profile_image(element['user_id']).subscribe((direccion:any) => {
        Object.defineProperty(element, 'pro_picture', {
          value: direccion['image_direction'],
          writable: true
        })
      });
    });
    
  //Se le añade la propiedad para saber si están abiertos los comentarios
  Object.defineProperty(this.publicaciones, 'isComment', {
    value: false,
    writable: true
  })

    //Se le añade la propiedad para saber si se dio a las opciones
    Object.defineProperty(this.publicaciones, 'isOptions', {
      value: false,
      writable: true
    })
  }
);
}



/* Eliminar publicaciones */
borrarPost(message_id: number, image_id: number){
  if(window.confirm("¿Esta seguro de borrar esta publicación? ")) {
  this.UsuariosService.BorrarPost(message_id).pipe(finalize(() => {
    if(image_id!=null){
      this.UsuariosService.BorrarImagen(image_id).subscribe(
        (data:any)=>{
          console.log(data);
        }
      )
    }
  }
  )).subscribe(next=>{
    this.ObtenerPost();
  }
  );
}
}



//Función que verifica el rol y en base a este muestra/oculta el administrar usuarios
ocultar(){
  if (this.UserRole?.rol_id == 2){

    this.administrador=true
    
  }
}



  /* que se muestre u oculten los me gustas */
  onEditClick_crz(id:number, i:number) {
    console.log("************************************")
    console.log("valor de id")
    console.log(id)

    console.log("valor de i")
    console.log(i)

    console.log("idReaction")
    console.log(this.publicaciones[i].idReaction);
    
    this.disabled ='no-pointer-events';
    console.log(this.publicaciones[i].likes)
    //----------Borrar la reacción-----------
    if(id!==undefined ){
      console.log("Borrar");
      this.UsuariosService.BorrarReaccion(id).pipe(finalize(() => {

        //Definir el id como undefined
          Object.defineProperties(this.publicaciones[i], {
                idReaction: {
                  value: undefined,
                  writable: true,
                },
              });
          console.log("indefinido:");
          console.log(this.publicaciones[i].isReaction)
        //Restarle uno a la cantidad actual de likes
          console.log(this.publicaciones[i].likes-1);
          this.UsuariosService.updatelikes_decr(this.publicaciones[i].message_id, this.publicaciones[i]).pipe(finalize(() => {
            this.publicaciones[i].likes=this.publicaciones[i].likes-1;
            this.disabled ='';
          })).subscribe(() => {
          });
    
      })).subscribe((data: any) => {
        console.log('borrar reaccion');
        console.log(data)
      }); 
    
    //----------Crear la reacción----------
    }else{
      console.log("Crear");
      let json=JSON.parse(JSON.stringify(this.publicaciones[i]));
      this.UsuariosService.setreaction(json).pipe(finalize(() => {
        
        console.log("valor de la publicacion");
        console.log(this.publicaciones[i]);
        console.log("valor de el message_id de acuerdo a la publicacion");
        console.log(this.publicaciones[i].message_id);
        //Añadir el id de reaccion al objeto de message  
        this.UsuariosService.ObtenerReaccion(this.publicaciones[i].message_id).subscribe((data:any)=>{
    /*     Object.defineProperty(this.publicaciones[i], 'idReaction', {
          value: data['id'],
          writable: true,
        }); */
     /*    if(data!=null){ */
          
        console.log("------------------------")
        console.log("asignar idReaction Data");
        console.log(data);
        console.log(data['id']);
        console.log(this.publicaciones[i]);
        Object.defineProperties(this.publicaciones[i], {
          idReaction: {
            value: data['id'],
            writable: true,
          },
        });
    
        console.log("Definido:");
        console.log(this.publicaciones[i].isReaction)
    /*   } */
      })
          //Sumarle uno a la cantidad actual de likes
          console.log(this.publicaciones[i].likes+1);
          this.publicaciones[i].likes=this.publicaciones[i].likes+1;
          this.UsuariosService.updatelikes_incr(this.publicaciones[i].message_id, this.publicaciones[i]).subscribe((result) => {
          this.disabled ='';
        });
      })).subscribe(
        (error) => {
          this.errors = error.error;
    });
   

    }
    //Asignar el valor del isReaction (si está reaccionado o no)
    Object.defineProperties(this.publicaciones[i], {
      isReaction: {
        value: !this.publicaciones[i].isReaction,
        writable: true,
      },
    });
  }




//Trae las reacciones si existen
Traerreaciones(){
  console.log("entro a inEditClick")
  this.publicaciones.forEach(element => {
    this.UsuariosService.ObtenerReaccion(element.message_id).subscribe((data:any)=>{
      /*     console.log(data['id']); */

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
        }
        );
  });
}




//----------------COMENTARIOS------------------

onEditClick_cm(id: number) {
  console.log("Entró")
  if (!this.publicaciones[id].isComment) {
    Object.defineProperty(this.publicaciones[id], 'isComment', {
      value: true,
      writable: true,
    });

  } else {
    Object.defineProperty(this.publicaciones[id], 'isComment', {
      value: false,
      writable: true,
    });
  }
  }
  posts(){
    this.id_post=this.publicaciones.map(item => item.id);
    console.log("Aquí es");
    console.log(this.id_post);
  }

  //DEVUELVE AL INICIO DEL SCROLL
  onScrollTop(): void{
    this.document.documentElement.scrollTop = 0;
  }

  onScrollDown():void{


        //Si esta filtrado o si no
        switch (this.filter) {

          case false:
            if(this.nextPage!==0){
              this.UsuariosService.pruebaByPage(this.nextPage).subscribe((data) => {
                if(typeof data['next_page_url'] === 'string'){
                  console.log(data['next_page_url'].substr(-1));
                  this.nextPage=Number(data['next_page_url'].substr(-1));
                }else{
                  this.nextPage=0;
                }
                
                this.publicacionesByPage = data['data'];
                this.publicacionesByPage.forEach(elemento => {
                  this.UsuariosService.ObtenerReaccion(elemento.message_id).subscribe((data:any)=>{
                    /*     console.log(data['id']); */
              
                    /* Se le asigna una nueva propiedad al objeto de publicaciones
                    que almacene temporalmente si el usuario
                    Le ha dado like a alguna publicación */
                    //Si no hay relaciones del usuario y la publicación, no se ha reaccionado a esta
                      if(data==null){
                        console.log("El valor es nulo");
                        Object.defineProperty(elemento, 'isReaction', {
                          value: false,
                          writable: true
                        });
                      }else{
                        Object.defineProperties(elemento, {
                          idReaction: {
                            value: data['id'],
                            writable: true,
                          },
                        });
                      }
                    });

                  this.UsuariosService.get_profile_image(elemento['user_id']).subscribe((direccion:any) => {
                    Object.defineProperty(elemento, 'pro_picture', {
                      value: direccion['image_direction'],
                      writable: true
                    })
                  });

                  this.publicaciones.push(elemento);
                    this.UsuariosService.ObtenerReaccion(elemento.message_id).subscribe((data:any)=>{
                      /*     console.log(data['id']); */
                
                      /* Se le asigna una nueva propiedad al objeto de publicaciones
                      que almacene temporalmente si el usuario
                      Le ha dado like a alguna publicación */
                      //Si no hay relaciones del usuario y la publicación, no se ha reaccionado a esta
                        if(data==null){
                          console.log("El valor es nulo");
                          Object.defineProperty(elemento, 'isReaction', {
                            value: false,
                            writable: true
                          });
                      //En caso de que hayan relaciones entre el usuario que inicio sesión y la publicación, se ha reaccionado a esta
                        }else{
                          console.log("El valor es valido");
                          Object.defineProperty(elemento, 'isReaction', {
                            value: true,
                            writable: true
                          })
                      //Añadir el id de reaccion al objeto de message  
                          Object.defineProperty(elemento, 'idReaction', {
                            value: data['id'],
                            writable: true,
                          });
                        }
                        }
                        );
                  });

                });


            }else{
              console.log("No se encontró la página");
            }
            break;

          case true:
            if(this.nextPage!==0){
              this.UsuariosService.ObtenerPosts(this.input,this.nextPage).subscribe((data: any) => {
                if(typeof data['next_page_url'] === 'string'){
                  console.log(data['next_page_url'].substr(-1));
                  this.nextPage=Number(data['next_page_url'].substr(-1));
                }else{
                  this.nextPage=0;
                }
                this.publicacionesByPage = data['data'];
                this.publicacionesByPage.forEach(elemento => {
                  this.UsuariosService.get_profile_image(elemento['user_id']).subscribe((direccion:any) => {
                    this.UsuariosService.ObtenerReaccion(elemento.message_id).subscribe((data:any)=>{
                      console.log("información mensaje")
                      console.log(data);
                
                      /* Se le asigna una nueva propiedad al objeto de publicaciones
                      que almacene temporalmente si el usuario
                      Le ha dado like a alguna publicación */
                      //Si no hay relaciones del usuario y la publicación, no se ha reaccionado a esta
                        if(data==null){
                          console.log("El valor es nulo");
                          Object.defineProperty(elemento, 'isReaction', {
                            value: false,
                            writable: true
                          });
                        }else{
                          Object.defineProperties(elemento, {
                            idReaction: {
                              value: data['id'],
                              writable: true,
                            },
                          });

                      //Asignar el valor del isReaction (si está reaccionado o no)
                      Object.defineProperties(elemento, {
                        isReaction: {
                          value: true,
                          writable: true,
                        },
                      });
                        }
                      });

                    Object.defineProperty(elemento, 'pro_picture', {
                      value: direccion['image_direction'],
                      writable: true
                    })
                  });
                  this.publicaciones.push(elemento);
                });
                console.log(this.publicaciones);
          });
            }else{
              console.log("No se encontró la página");
            }
            break;

          default:
            break;
        }
       
   
  }

  //Mostrar/ocultar las opciones de editar y eliminar
  mostrarOcultar_opciones(index:number){
    console.log("holis")
    console.log(this.publicaciones[index]);
    
     //Se le añade la propiedad para saber si se dio a las opciones
     if(this.publicaciones[index].isOptions){
     Object.defineProperty(this.publicaciones[index], 'isOptions', {
      value: false,
      writable: true
    })
  }else{
    Object.defineProperty(this.publicaciones[index], 'isOptions', {
      value: true,
      writable: true
    })
  }
  }


  //Filtrar publicaciones
  filterPost(event: any) {
    if (event.key === "Enter") {
      if(event.target.value.length !== 0){
        /* Está filtrando */
        this.filter = true;

        console.log(event.target.value);
        this.input=event.target.value;
        this.UsuariosService.ObtenerPosts(event.target.value, 1)
        .pipe(finalize(() => {
          this.Traerreaciones();
          this.posts();
        })).subscribe((data: any) => {
          if(typeof data['next_page_url'] === 'string'){
            console.log(data['next_page_url'].substr(-1));
            this.nextPage=Number(data['next_page_url'].substr(-1));
          }
          this.publicaciones = data['data'];
          this.publicaciones.forEach(element => {

            this.UsuariosService.get_profile_image(element['user_id']).subscribe((direccion:any) => {
              Object.defineProperty(element, 'pro_picture', {
                value: direccion['image_direction'],
                writable: true
              })
            });
          });
        });
         //Se le añade la propiedad para saber si están abiertos los comentarios
          Object.defineProperty(this.publicaciones, 'isComment', {
            value: false,
            writable: true
          })
        //Se le añade la propiedad para saber si se dio a las opciones
        Object.defineProperty(this.publicaciones, 'isOptions', {
          value: false,
          writable: true
        })

    }else{
        this.ObtenerPost();
      }
  }
}

recibir_padre_post(mensaje: any){
  console.log("Mensaje 2:")
  console.log(mensaje);
  console.log("responses");

  this.UsuariosService.updateresponses_incr(mensaje.id_post, this.publicaciones[mensaje.indice].responses).subscribe((result) => {
    this.publicaciones[mensaje.indice].responses=this.publicaciones[mensaje.indice].responses+1;
    console.log("resultado de emit 2")
    console.log(mensaje.indice + this.id_post)
  
/*     if(this.id_post !== undefined){
      console.log("this.id_post");
      this.UsuariosService.updateresponses_incr(mensaje, this.comentarios[mensaje].responses).subscribe((result) => {
      });
    } */
});
}

otrafuncion(event: any){
  console.log("No entra a otra función:");
  console.log(event);
  this.UsuariosService.updateresponses_incr(event.id_post, this.publicaciones[event.indice].responses).subscribe((result) => {
    this.publicaciones[event.indice].responses=this.publicaciones[event.indice].responses+1;
    console.log(result);});
  }

  refresh_post(){
    this.ObtenerPost();
  }

  recibirMensaje(mensaje: any){
    this.publicaciones[Number(mensaje.indice)].responses = this.publicaciones[Number(mensaje.indice)].responses+mensaje.num;
    if(mensaje.num<0){
      this.UsuariosService.simpleupdateresponses_decr(this.publicaciones[Number(mensaje.indice)].id, this.publicaciones, Math.abs(mensaje.num)).subscribe(()=>{
        
      });
    }
    //Si existe un padre (si no es publicación, se resta 1 a responses)
  }
  
}
