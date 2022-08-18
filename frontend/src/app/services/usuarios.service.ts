import { Reaction } from './reaction';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario'
import { Injectable } from '@angular/core';
import { Sector } from './sector';
import { tap } from 'rxjs/operators';
/* import { JwtHelperService } from '@auth0/angular-jwt';
 */

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private _refresh_commentary$ = new Subject < void > ();

  //URL: string='https://server.mueblesluxury.com.co/api/';
  URL: string='http://127.0.0.1:8000/api/';

  constructor(private clienteHttp:HttpClient) { 
  }
  
ngOnInit(): void {
  this.ObtenerUsuarios();
}
set_changedProPic(datosImage:FormData){
  return this.clienteHttp.post(this.URL + 'user/changedProPic',datosImage);
}
    //
    get_profile_image(id:number){
      return this.clienteHttp.get(this.URL + 'user/image/'+id);
    }
//Obtener el número de registros de publicaciones de acuerdo al id
  getcommentarieslist(id:number){
    return this.clienteHttp.get(this.URL + `commentaries/${id}`);
  }
  //Eliminar imagenes
  BorrarImagen(id:number){
    return this.clienteHttp.delete(this.URL + 'image/delete/'+id);
  }
  //Recargar comentarios
  get refresh_commentary$(){
    return this._refresh_commentary$;
  }

  //
  CreateImage(datosImage:FormData):Observable<any>{
    return this.clienteHttp.post(this.URL + "message/image", datosImage)
  }


  //Actualizar mensaje
  CreateMessage(datosMessage:any):Observable<any>{
    return this.clienteHttp.post(this.URL + "message/create", datosMessage).pipe(
      tap(()=>{
      this._refresh_commentary$.next();
        }
      )
    );
  }


  //Traer mensajes por página
  pruebaByPage(id:number):Observable<any>{
    return this.clienteHttp.get(this.URL + "message/prueba?page=" +id);
  }

  //Actualizar mensaje
  UpdateMessage(id:number, datosMessage:any):Observable<any>{
    return this.clienteHttp.put(this.URL + "message/update/" +id, datosMessage);
  }

  // Obtener el mensaje a modificar
  get_message(id: number): Observable<any> {
    return this.clienteHttp.get(this.URL + 'post/' + id);
  }

  // Obtener lista de comentarios de acuerdo al id de la publicación
  get_commentary(id: number, page: number): Observable<any> {
    return this.clienteHttp.get(this.URL + 'message/' + id + "?page=" + page);
  }

  // User registration
  register(user: Usuario): Observable<any> {
    return this.clienteHttp.post(this.URL + 'auth/register', user);
  }

  // Login
  signin(user: Usuario): Observable<any> {
    return this.clienteHttp.post<any>(this.URL + 'auth/login', user);
  }
  // Access user profile
  profileUser(): Observable<any> {
    return this.clienteHttp.get(this.URL + 'auth/user-profile');
  }
  // buscar id de sector
  sectorid(position:any, area:any): Observable<any> {
    return this.clienteHttp.get(this.URL + `sector/${area}/${position}`);
  }
  //crear un nuevo sector
  setsector(sector:Sector): Observable<any> {
    return this.clienteHttp.post(this.URL + 'sector',sector);
  }
  //Obtener el array de usuarios existentes
  ObtenerUsuarios(){
    return this.clienteHttp.get(this.URL + 'user');
  }
  //Eliminar publicación
  BorrarPost(id:number){
    return this.clienteHttp.delete(this.URL + 'message/'+id);
  }
  //Registrar usuario
  AgregarUsuario(datosUsuario:Usuario):Observable<any>{
/*    return this.clienteHttp.post(this.URL+"insertar=1", datosUsuario )
 */   return this.clienteHttp.post(this.URL  + 'user/', datosUsuario );
  }
  BorrarUsuario(id:number){
    return this.clienteHttp.delete(this.URL  + 'user/' +id );
      }
  ObtenerUsuario(id:number){
    return this.clienteHttp.get(this.URL  + 'user/' +id);
  }
  //Obtener reacciones de usuario
  ObtenerReaccion(id:any){
    return this.clienteHttp.get(this.URL + 'reaction/' + id);
  }

  //Actualizar usuario
  UpdateUser(id:number, datosUsuario:any):Observable<any>{
    return this.clienteHttp.put(this.URL + "user/update/" +id, datosUsuario);
  }
  //Obtener las publicaciones
  ObtenerPosts(input:any, page:number){
    return this.clienteHttp.get(this.URL + `message/src/${input}?page=${page}`);
  }
  //Borrar una reacción
  BorrarReaccion(id:number){
    return this.clienteHttp.delete(this.URL + 'reaction/'+id );
      }

  //crear una nueva reacción
  setreaction(reaction:Reaction): Observable<any> {
    return this.clienteHttp.post(this.URL + 'reaction',reaction);
  }

/*   //actualizar el número de likes
  updatelikes(id: number,likes: number): Observable<any> {
    return this.clienteHttp.post(`http://127.0.0.1:8000/api/message/${id}`, likes);
  } */

    //actualizar el número de likes(suma)
    updatelikes_incr(id: number,likes: number): Observable<any> {
      return this.clienteHttp.put(this.URL + `message_incr/${id}`, likes);
    }
      //actualizar el número de likes(resta)
      updatelikes_decr(id: number,likes: number): Observable<any> {
        return this.clienteHttp.put(this.URL + `message_decr/${id}`, likes);
      }

    //actualizar el número de responses(suma)
    updateresponses_incr(id: number,responses: number): Observable<any> {
      return this.clienteHttp.post(this.URL + `messager_incr/${id}`, responses);
    }

    //actualizar el número de responses(resta)
    updateresponses_decr(id: number,responses: any, current_id:number): Observable<any> {
      return this.clienteHttp.post(this.URL + `messager_decr/${id}/${current_id}`, responses);
    }

    //actualizar el número de responses(resta)
    simpleupdateresponses_decr(id: number,responses: any, num:number): Observable<any> {
      return this.clienteHttp.post(this.URL + `smessager_decr/${id}/${num}`, responses);
    }

    //Traer la fecha en la que se cambio la contraseña
    changedPassword():Observable<any>{
      return this.clienteHttp.get(this.URL + "user/changedPassword");
    }
    
   //Modificar contraseña
    changingPassword(datosPassword:any):Observable<any>{
      return this.clienteHttp.post(this.URL + "user/changedPassword", datosPassword);
    }

  //Generar la restauración de contraseña
    restore_pass(datosPassword:any):Observable<any>{
      return this.clienteHttp.post(this.URL + "user/restore", datosPassword);
    }
  //Devolver true si la contraseña coincide
    comparepassword():Observable<any>{
      return this.clienteHttp.get(this.URL + 'user/comparePassword');
    }
}