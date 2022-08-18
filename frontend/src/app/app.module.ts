import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModAuthUserComponent } from './components/both_components/perfil/mod-auth-user/mod-auth-user.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateUserComponent } from './components/admin_components/admin/users/create-user/create-user.component';
import { GeneralMenuComponent } from './components/both_components/general-menu/general-menu.component';
import { LoginComponent } from './components/both_components/login/login.component';
import { FeedComponent } from './components/both_components/feed/feed.component';
import { CommentComponent } from './components/both_components/publications/comment/comment.component';
import { CommentaryComponent } from './components/both_components/publications/commentary/commentary.component';
import { AgregarPostComponent } from './components/admin_components/admin/posts/agregar-post/agregar-post.component';
import { AdminMenuComponent } from './components/both_components/admin-menu/admin-menu.component';
import { RestaurarPasswordComponent } from './components/both_components/restaurar-password/restaurar-password.component';
import { DirectorioComponent } from './components/both_components/directorio/directorio.component';
import { DirectorioAdminComponent } from './components/admin_components/directorio-admin/directorio-admin.component';
import { UsersComponent } from './components/admin_components/admin/users/users.component';
import { BuscadorComponent } from './components/both_components/buscador/buscador.component';
import { PerfilComponent } from './components/both_components/perfil/perfil.component';
import { ModUserComponent } from './components/admin_components/admin/users/mod-user/mod-user.component';
import { AuthInterceptor } from './shared/auth-interceptor.service';
import { CommonModule } from '@angular/common';
import { ModPostComponent } from './components/admin_components/admin/posts/mod-post/mod-post.component';
import { FilterUserPipe } from './pipes/filter/filter-user.pipe';
import { ModalPasswordComponent } from './components/both_components/feed/modal-password/modal-password.component';
import { ModalChangePasswordComponent } from './components/both_components/perfil/modal-change-password/modal-change-password.component';
//import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    GeneralMenuComponent,
    LoginComponent,
    FeedComponent,
    CommentComponent,
    CommentaryComponent,
    AgregarPostComponent,
    AdminMenuComponent,
    RestaurarPasswordComponent,
    DirectorioComponent,
    DirectorioAdminComponent,
    UsersComponent,
    BuscadorComponent,
    PerfilComponent,
    ModUserComponent,
    ModAuthUserComponent,
    ModPostComponent,
    FilterUserPipe,
    ModalPasswordComponent,
    ModalChangePasswordComponent
        ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    //DataTablesModule

    
  ],
  providers: [DatePipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {provide: LocationStrategy,
    useClass: HashLocationStrategy},]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
