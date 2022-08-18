import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  modalPassSwitch:boolean=false;
  title = 'frontend';
  errors: any = null;

  constructor(
    public UsuariosService: UsuariosService
  ){}

  ngOnInit(): void {
    console.log("Contraseña cambio")
    this.UsuariosService.changedPassword().subscribe((data:any)=>{
      console.log(data);
      if(data['changed_password']){
        this.modalPassSwitch=true;

    }
  })
}

}