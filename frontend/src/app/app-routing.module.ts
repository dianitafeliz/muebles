import { ModPostComponent } from './components/admin_components/admin/posts/mod-post/mod-post.component';
import { DirectorioAdminComponent } from './components/admin_components/directorio-admin/directorio-admin.component';
import { LoginComponent } from './components/both_components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { CreateUserComponent } from './components/admin_components/admin/users/create-user/create-user.component';
import { AgregarPostComponent } from './components/admin_components/admin/posts/agregar-post/agregar-post.component';
import { FeedComponent } from './components/both_components/feed/feed.component';
import { RestaurarPasswordComponent } from './components/both_components/restaurar-password/restaurar-password.component';
import { UsersComponent } from './components/admin_components/admin/users/users.component';
import { PerfilComponent } from './components/both_components/perfil/perfil.component';
import { ModUserComponent } from './components/admin_components/admin/users/mod-user/mod-user.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { ModAuthUserComponent } from './components/both_components/perfil/mod-auth-user/mod-auth-user.component';

const routes: Routes = [
  {path: '',
   redirectTo:'/Home',
    pathMatch: 'full'},

  {path: 'Usuarios/Registro',
    component:CreateUserComponent,
    canActivate:[RoleGuard],
    data: { 
     expectedRole: 2
    }
},

  {path: 'Iniciar_sesion',
   component:LoginComponent},
   
   {path: 'Restore',
   component:RestaurarPasswordComponent},

  {path: 'Publicar',
   component:AgregarPostComponent,
   canActivate:[RoleGuard],
   data: { 
    expectedRole: 2
   }},

  {path: 'Home',
   component:FeedComponent,
   canActivate:[AuthGuard]},

  {path: 'Directorio',
   component:DirectorioAdminComponent,
   canActivate:[AuthGuard]},

  {path: 'Usuarios',
   component:UsersComponent,
   canActivate:[RoleGuard],
   data: { 
    expectedRole: 2
   }
  },


  {path: 'Mi_perfil',
   component:PerfilComponent,
   canActivate:[AuthGuard]},

  {path: 'Usuarios/Modificar/:id',
   component:ModUserComponent,
   canActivate:[RoleGuard],
   data: { 
    expectedRole: 2
   }
  },

  {path: 'Usuarios/Modificar',
  component:ModAuthUserComponent,
  canActivate:[AuthGuard]},

  {path: 'Home/Modificar/:id',
  component:ModPostComponent,
  canActivate:[AuthGuard]
 },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
