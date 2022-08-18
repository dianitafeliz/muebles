import { UsuariosService } from 'src/app/services/usuarios.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../token.service';

class role{
  rol_id!:String;
}
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  UserRole!: role;
  constructor(
    private tokens: TokenService,
    private route: Router,
    public UsuariosService: UsuariosService
    
    ){
      this.UsuariosService.profileUser().subscribe((data: any) => {
      this.UserRole = data;
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const expectedRole = route.data['expectedRole'];

      if (!this.tokens.getToken() ||  this.UserRole?.rol_id !== expectedRole) {
        this.route.navigate(['']);
       return false;
      }
      return true;
  }
  
}
