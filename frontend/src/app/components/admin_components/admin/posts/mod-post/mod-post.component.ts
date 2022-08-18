import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-mod-post',
  templateUrl: './mod-post.component.html',
  styleUrls: ['./mod-post.component.scss']
})
export class ModPostComponent implements OnInit {
  //Array de la publicación a mostrar
  publicacion: any[] = [];

  modPostForm:FormGroup;
  errors: any = null;
  sectorinput: any = null;
  sectorid:any = null;
  constructor(
    private route: ActivatedRoute,
    public formulario:FormBuilder,
    public router: Router,
    public UsuariosService:UsuariosService,
  ) { 
    this.modPostForm=new FormGroup({
      text:new FormControl(''),
/*       image_id:new FormControl('')
 */     })
  }
//Obtener el mensaje con sus datos de acuerdo al id
obtenerMensaje(message_id: number){
  this.UsuariosService.get_message(message_id).subscribe(
    (data:any) => {

      this.modPostForm=new FormGroup({
        text:new FormControl(data['text']),
/*         image_id:new FormControl(data['image_id'])
 */       })
     this.publicacion.push(data);
     console.log(this.publicacion);
  }
);
}
  ngOnInit(): void {
    this.obtenerMensaje(this.route.snapshot.params['id']);
    
  }
actualizarMesage(){
  console.log("hola")
  this.UsuariosService.UpdateMessage(this.route.snapshot.params['id'], this.modPostForm.value).
        subscribe(()=>{
          this.router.navigate(['Home']);
        });
}

}
